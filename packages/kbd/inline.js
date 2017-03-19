function locator (value, fromIndex) {
  const index = value.indexOf('||', fromIndex)
  return index
}

function inlinePlugin (opts = {}) {
  function inlineTokenizer (eat, value, silent) {
    const keep = /\|\|(.+?)\|\|/.exec(value)
    if (keep) {
      if (keep.index !== 0) {
        return true
      }
      if (silent) {
        return true
      }
      eat(keep[0])({
        type: 'kbd',
        data: {
          hName: 'kbd',
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
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'kbd')

  const Compiler = this.Compiler

  // Stringify
  if (Compiler != null) {
    const visitors = Compiler.prototype.visitors
    visitors.kdb = function (node) {
      return `||${node.data.hChildren[0].value}||`
    }
  }
}

module.exports = inlinePlugin
