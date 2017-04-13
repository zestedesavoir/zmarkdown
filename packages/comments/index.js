const beginMarker = '<--COMMENTS'
const endMarker = 'COMMENTS-->'
const SPACE = ' '

function locator (value, fromIndex) {
  const index = value.indexOf(beginMarker, fromIndex)
  return index
}

function inlinePlugin (opts = {}) {
  function inlineTokenizer (eat, value, silent) {

    if (silent) return

    const keepBegin = value.indexOf(beginMarker)
    const keepEnd = value.indexOf(endMarker)
    if (keepBegin !== 0 || keepEnd === -1) return

    const comment = value.substring(beginMarker.length + 1, keepEnd - 1)
    return eat(beginMarker + SPACE + comment + SPACE + endMarker)
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.comments = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'comments')
}

module.exports = inlinePlugin
