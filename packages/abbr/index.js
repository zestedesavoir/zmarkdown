function inlinePlugin (opts = {}) {

  function locator (value, fromIndex) {
    return value.indexOf('*[', fromIndex)
  }

  function inlineTokenizer (eat, value, silent) {
    const regex = new RegExp(/[*]\[([^\]]*)\]:\s*(.+)\n*/)
    const keep = regex.exec(value)

    if (silent) return silent
    if (!keep || keep.index !== 0) return

    return eat(keep[0])({
      type: 'abbr',
      data: {
        hName: 'abbr',
        hProperties: {
          word: keep[1],
          desc: keep[2]
        }
      },
    })
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.get_abbr = inlineTokenizer
  inlineMethods.splice(0, 0, 'get_abbr')
}

module.exports = inlinePlugin
