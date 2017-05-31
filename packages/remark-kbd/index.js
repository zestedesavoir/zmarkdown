const whitespace = require('is-whitespace-character')

const C_PIPE = '|'
const DOUBLE = '||'

function locator (value, fromIndex) {
  const index = value.indexOf(DOUBLE, fromIndex)
  return index
}

function plugin () {
  function inlineTokenizer (eat, value, silent) {
    if (
      !this.options.gfm ||
      value.charAt(0) !== C_PIPE ||
      value.charAt(1) !== C_PIPE ||
      value.startsWith(C_PIPE.repeat(4)) ||
      whitespace(value.charAt(2))
    ) {
      return
    }

    let character = ''
    let previous = ''
    let preceding = ''
    let subvalue = ''
    let index = 1
    const length = value.length
    const now = eat.now()
    now.column += 2
    now.offset += 2

    while (++index < length) {
      character = value.charAt(index)

      if (
        character === C_PIPE &&
        previous === C_PIPE &&
        (!preceding || !whitespace(preceding))
      ) {

        /* istanbul ignore if - never used (yet) */
        if (silent) return true

        return eat(DOUBLE + subvalue + DOUBLE)({
          type: 'kbd',
          children: this.tokenizeInline(subvalue, now),
          data: {
            hName: 'kbd',
          },
        })
      }

      subvalue += previous
      preceding = previous
      previous = character
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
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    visitors.kbd = function (node) {
      return `||${this.all(node).join('')}||`
    }
  }
}

module.exports = plugin
