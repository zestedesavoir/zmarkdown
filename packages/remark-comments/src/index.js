const beginMarkerFactory = (marker = 'COMMENTS') => `<--${marker}`
const endMarkerFactory = (marker = 'COMMENTS') => `${marker}-->`
const SPACE = ' '

function plugin ({beginMarker = 'COMMENTS', endMarker = 'COMMENTS'} = {}) {
  beginMarker = beginMarkerFactory(beginMarker)
  endMarker = endMarkerFactory(endMarker)

  function locator (value, fromIndex) {
    return value.indexOf(beginMarker, fromIndex)
  }

  function inlineTokenizer (eat, value, silent) {
    const keepBegin = value.indexOf(beginMarker)
    const keepEnd = value.indexOf(endMarker)
    if (keepBegin !== 0 || keepEnd === -1) return

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    const comment = value.substring(beginMarker.length + 1, keepEnd - 1)
    return eat(beginMarker + SPACE + comment + SPACE + endMarker)({
      type: 'comments',
      data: {comment},
      value: '',
    })
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.comments = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'comments')

  const Compiler = this.Compiler
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    if (!visitors) return
    visitors.comments = (node) => {
      return beginMarker + SPACE + node.data.comment + SPACE + endMarker
    }
  }
}

module.exports = plugin
