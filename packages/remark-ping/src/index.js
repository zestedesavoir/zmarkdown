const visit = require('unist-util-visit')
const interruptPunctuation = [
  require('@unicode/unicode-13.0.0/Binary_Property/White_Space/code-points'),
  require('@unicode/unicode-13.0.0/General_Category/Close_Punctuation/code-points'),
  require('@unicode/unicode-13.0.0/General_Category/Final_Punctuation/code-points'),
  require('@unicode/unicode-13.0.0/General_Category/Initial_Punctuation/code-points'),
  require('@unicode/unicode-13.0.0/General_Category/Open_Punctuation/code-points'),
  require('@unicode/unicode-13.0.0/General_Category/Other_Punctuation/code-points')
].flat()

const isInterrupt = c => interruptPunctuation.includes(c.charCodeAt(0))
const containsInterrupt = str => {
  for (let c = 0; c < str.length; c++) {
    const char = str.charAt(c)

    if (isInterrupt(char)) return true
  }

  return false
}

const helpMsg = `remark-ping: expected configuration to be passed: {
  pingUsername: (username) => bool,\n  userURL: (username) => string\n}`

module.exports = function plugin ({
  pingUsername,
  userURL,
  pingCharacter = '@',
  fencedStartSequence = '**',
  fencedEndSequence = '**'
}) {
  if (typeof pingUsername !== 'function' || typeof userURL !== 'function') {
    throw new Error(helpMsg)
  }

  function inlineTokenizer (eat, value, silent) {
    let isFenced = false
    let eaten = pingCharacter
    let username = ''
    let c = 1

    /* istanbul ignore if - never used (yet) */
    if (silent) return silent
    if (value.charAt(0) !== pingCharacter) return

    // Check if we have a fenced sequence
    if (value.substring(1).startsWith(fencedStartSequence)) {
      eaten += fencedStartSequence
      isFenced = true
      c += 2
    }

    // Iterate until:
    //   - end of string;
    //   - interrupt character for unfenced pings;
    //   - trailing sequence for fenced pings.
    while (value.charAt(c)) {
      if (!isFenced && isInterrupt(value.charAt(c))) break
      if (isFenced &&
          value.substring(c - 2).startsWith(fencedEndSequence) &&
          isInterrupt(value.charAt(c))) break

      username += value.charAt(c++)
    }

    eaten += username

    // Remove trailing sequence
    if (isFenced) {
      if (!username.endsWith(fencedEndSequence)) return

      username = username.slice(0, -fencedEndSequence.length)
    }

    if (pingUsername(username) === true && username.trim() !== '') {
      const url = userURL(username)

      return eat(eaten)({
        type: 'ping',
        username,
        url,
        data: {
          hName: 'a',
          hProperties: {
            href: url,
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
            value: username
          }]
        }]
      })
    } else {
      return eat(eaten.charAt(0))({
        type: 'text',
        value: eaten.charAt(0)
      })
    }
  }

  function locator (value, fromIndex) {
    return value.indexOf('@', fromIndex)
  }

  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.ping = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'ping')

  const Compiler = this.Compiler

  // Stringify
  if (Compiler) {
    const visitors = Compiler.prototype.visitors

    visitors.ping = (node) => {
      if (!containsInterrupt(node.username)) {
        return pingCharacter + node.username
      }

      return pingCharacter + fencedStartSequence + node.username + fencedEndSequence
    }
  }

  return (tree, file) => {
    // mark pings in blockquotes, later on we'll need that info to avoid pinging from quotes
    visit(tree, 'blockquote', markInBlockquotes)
    // remove ping links from pings already in links
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
        // collect usernames to ping, they will be made available on the vfile
        // for some backend to act on
        file.data[node.type].push(node.username)
      }
    })
  }
}

function markInBlockquotes (node) {
  mark(node)

  if (node.children) {
    node.children.map((n, i) => markInBlockquotes(n))
  }
}

function mark (node) {
  if (node.type === 'ping') node.__inBlockquote = true
}
