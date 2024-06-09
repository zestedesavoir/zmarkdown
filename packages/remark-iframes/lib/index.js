import syntax from 'micromark-extension-iframes'
import { visit } from 'unist-util-visit'

import embedRequest from './request.js'

const DEFAULT_CHARS = {
  exclamationMark: '!',
  openingChar: '(',
  closingChar: ')'
}

function fromMarkdown () {
  function enterIframeLink (token) {
    this.enter({
      type: 'iframe',
      src: '',
      data: {
        hName: 'iframe',
        hProperties: {
          src: ''
        }
      },
      children: []
    }, token)

    this.buffer()
  }

  function exitIframeLink (token) {
    const context = this.stack[this.stack.length - 2]
    const src = this.resume()

    // This src is used for compiling to Markdown
    // and to resolve embed links.
    context.src = src

    this.exit(token)
  }

  return {
    enter: {
      iframeLink: enterIframeLink
    },
    exit: {
      iframeLink: exitIframeLink
    }
  }
}

function toMarkdown (chars) {
  handleIframe.peek = peekIframe

  function handleIframe (node, _, state, info) {
    const tracker = state.createTracker(info)
    const exit = state.enter('iframe')
    let value = tracker.move(chars.exclamationMark + chars.openingChar)

    value += tracker.move(
      state.safe(node.src, {
        ...tracker.current(),
        before: value,
        after: chars.closingChar
      })
    )

    value += tracker.move(chars.closingChar)
    exit()
    return value
  }

  function peekIframe () {
    return chars.exclamationMark
  }

  return {
    handlers: { iframe: handleIframe }
  }
}

export default function iframePlugin (options = {}) {
  const data = this.data()
  const chars = options.chars || {}
  const charCodes = {}
  const providers = options.providers

  if (typeof providers !== 'object' || !Object.keys(providers).length) {
    throw new Error('remark-iframes needs to be passed a provider object as option')
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
  add('fromMarkdownExtensions', fromMarkdown())
  add('toMarkdownExtensions', toMarkdown(chars))

  // Visit all iframes to make embed requests
  return async (tree, vfile) => {
    // Visit doesn't support async visitors but supports async transformers
    const iframeNodes = []

    visit(tree, node => {
      if (node.type !== 'iframe') return

      iframeNodes.push(node)
    })

    await Promise.all(iframeNodes.map(async node =>
      embedRequest(node.src, providers).then(embedResult => {
        node.thumbnail = embedResult.thumbnail

        Object.assign(node.data.hProperties, {
          src: embedResult.url,
          width: embedResult.width,
          height: embedResult.height,
          allowfullscreen: true,
          frameborder: '0'
        })

        if (embedResult.lazyLoad) node.data.hProperties.loading = 'lazy'
      }).catch(e => {
        // If URL didn't match, fall back to paragraph
        node.type = 'paragraph'
        node.children = [{ type: 'text', value: `!(${node.src})` }]
        node.data = {}

        // Add error to the vfile
        let { message } = e

        if (e.name === 'AbortError') {
          message = `oEmbed URL timeout: ${node.src}`
        }

        vfile.message(message, node.position, node.src)
      })
    ))

    return tree
  }
}
