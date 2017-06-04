const BEGINMARKER = '<--COMMENTS'
const ENDMARKER = 'COMMENTS-->'
const SPACE = ' '

function locator (value, fromIndex) {
  return value.indexOf(BEGINMARKER, fromIndex)
}

function plugin (opts = {}) {
  function inlineTokenizer (eat, value, silent) {

    const keepBegin = value.indexOf(BEGINMARKER)
    const keepEnd = value.indexOf(ENDMARKER)
    if (keepBegin !== 0 || keepEnd === -1) return

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    const comment = value.substring(BEGINMARKER.length + 1, keepEnd - 1)
    return eat(BEGINMARKER + SPACE + comment + SPACE + ENDMARKER)
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.comments = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'comments')
}

module.exports = plugin
