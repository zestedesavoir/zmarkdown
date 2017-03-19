function locator (value, fromIndex) {
  const index = value.indexOf('||', fromIndex)
  return index
}

function inlinePlugin (opts = {}) {
  function inlineTokenizer (eat, value, silent) {
    const keep = /~~(\w(\w|\s)*)~~/.exec(value)
    if (keep) {
      if (keep.index !== 0) {
        return true
      }
      if (silent) {
        return true
      }
      if(keep.length < 2 || keep[1] === ""){
        return true;
      }
      eat(keep[0])({
        type: 'del',
        data: {
          hName: 'del',
          hChildren: [{
            type: 'text',
            value: keep[1],
          }],
        },
      })
    }
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.kbd = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'del')
}

module.exports = inlinePlugin
