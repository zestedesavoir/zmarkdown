function locator (value, fromIndex) {
  return value.indexOf('\\', fromIndex)
}

function inlinePlugin (opts = {}) {
  function inlineTokenizer (eat, value, silent) {
    if (value.startsWith("\\~") || value.startsWith("\\^")) {
      if (silent) {
        return true
      }
      eat(value.substring(0, 2))({
        type: 'text',
        value: value[1]
      })

    }
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.unescape = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'unescape')
}

module.exports = inlinePlugin
