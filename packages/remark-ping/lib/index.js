import syntax from 'micromark-extension-ping'
import { visit } from 'unist-util-visit'

const DEFAULT_CHARS = {
  pingChar: '@',
  sequenceChar: '*'
}

function fromMarkdown (userURL) {
  function enterPingContent (token) {
    this.enter({
      type: 'ping',
      username: '',
      url: '',
      data: {
        hName: 'a',
        hProperties: {
          href: '',
          rel: 'nofollow',
          class: 'ping ping-link'
        }
      },
      children: [{
        type: 'text',
        value: '@'
      }, {
        type: 'emphasis',
        data: {
          hName: 'span',
          hProperties: {
            class: 'ping-username'
          }
        },
        children: [{
          type: 'text',
          value: ''
        }]
      }]
    }, token)

    this.buffer()
  }

  function exitPingContent (token) {
    const context = this.stack[this.stack.length - 2]
    const username = this.resume()
    const url = userURL(username)

    context.url = url
    context.username = username
    context.data.hProperties.href = url
    context.children[1].children[0].value = username

    this.exit(token)
  }

  return {
    enter: {
      pingContent: enterPingContent
    },
    exit: {
      pingContent: exitPingContent
    }
  }
}

function toMarkdown (chars) {
  handlePing.peek = peekPing

  function handlePing (node) {
    return chars.pingChar + chars.sequenceChar + chars.sequenceChar + node.username + chars.sequenceChar + chars.sequenceChar
  }

  function peekPing () {
    return chars.pingChar
  }

  return {
    handlers: { ping: handlePing }
  }
}

function markInBlockquotes (node) {
  if (node.type === 'ping') node.__inBlockquote = true

  if (node.children) {
    node.children.map(n => markInBlockquotes(n))
  }
}

export default function pingPlugin (options = {}) {
  const data = this.data()
  const chars = options.chars || {}
  const userURL = options.userURL
  const charCodes = {}

  if (typeof userURL !== 'function') {
    throw new Error('remark-ping: expected configuration to be passed: {userURL: (username) => string}')
  }

  // Default chars when not provided
  for (const [key, defaultChar] of Object.entries(DEFAULT_CHARS)) {
    if (typeof chars[key] !== 'string') {
      chars[key] = defaultChar
    }

    charCodes[key] = chars[key].charCodeAt(0)
  }

  function add (field, value) {
    if (data[field]) data[field].push(value)
    else data[field] = [value]
  }

  // Inject handlers
  add('micromarkExtensions', syntax(charCodes))
  add('fromMarkdownExtensions', fromMarkdown(userURL))
  add('toMarkdownExtensions', toMarkdown(chars))

  return (tree, file) => {
    // Mark pings which are in blockquotes
    // This information will be needed to avoid pinging from quotes
    visit(tree, 'blockquote', markInBlockquotes)

    // Remove ping links from pings already in links
    visit(tree, 'link', (node) => {
      visit(node, 'ping', (ping, index) => {
        ping.data.hName = 'span'
        ping.data.hProperties = { class: 'ping ping-in-link' }
      })
    })

    visit(tree, 'ping', (node) => {
      if (!node.__inBlockquote) {
        if (!file.data[node.type]) {
          file.data[node.type] = []
        }
        // Collect usernames to ping
        // The backend can therefore process these pings, which
        // are included in the vfile.
        file.data[node.type].push(node.username)
      }
    })
  }
}
