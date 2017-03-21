function locator (value, fromIndex) {
  const index = value.indexOf('^', fromIndex) == -1? value.indexOf('~', fromIndex):value.indexOf('^', fromIndex)
  return index
}

function inlinePlugin (opts = {}) {
  function inlineTokenizer (eat, value, silent) {
    if(value.startsWith("~") && !value.startsWith("~ ")) {
      let escaped = value.indexOf("\\~")
      let i = 1
      while (i < value.length && (value[i] !== "~" || value[i - 1] === "\\")) {
        i++
      }
      if(i !== value.length) {
        if (silent) {
          return true
        }
        eat(value.substring(0, i + 1))({
          type: 'sub',
          data: {
            hName: 'sub',
            hChildren: [{
              type: 'text',
              value: value.substring(1, i),
            }],
          },
        })
      }
    }
    else if (value.startsWith("^") && !value.startsWith("^ ")) {
      let i = 1
      while (i < value.length && (value[i] !== "^" || value[i - 1] === "\\")) {
        i++
      }
      if(i !== value.length) {
        if (silent) {
          return true
        }
        eat(value.substring(0, i +1))({
          type: 'sup',
          data: {
            hName: 'sup',
            hChildren: [{
              type: 'text',
              value: value.substring(1, i),
            }],
          },
        })
      }
    }
  }

  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.sub_super = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'sub_super')
}

module.exports = inlinePlugin
