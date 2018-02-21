function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
}

const SPACE = ' '

module.exports = function inlinePlugin (ctx) {
  const emoticonClasses = ctx && ctx.classes
  const emoticons = ctx && ctx.emoticons
  const pattern = Object.keys(emoticons).map(escapeRegExp).join('|')

  if (!pattern) {
    throw new Error('remark-emoticons needs to be passed a configuration object as option')
  }

  const regex = new RegExp(`(\\s|^)(${pattern})(\\s|$)`)

  function locator (value, fromIndex) {
    const keep = regex.exec(value)
    if (keep && value[keep.index] === SPACE) return keep.index + 1
    return -1
  }

  function inlineTokenizer (eat, value, silent) {
    const keep = regex.exec(value)
    if (keep) {
      if (keep.index !== 0) return true

      /* istanbul ignore if - never used (yet) */
      if (silent) return true

      let toEat = keep[0]
      if (toEat.charAt(toEat.length - 1) === SPACE) {
        toEat = toEat.substring(0, toEat.length - 1)
      }
      const emoticon = toEat.trim()
      const emoticonNode = {
        type: 'emoticon',
        code: emoticon,
        data: {
          hName: 'img',
          hProperties: {
            src: emoticons[emoticon],
            alt: emoticon,
          },
        },
      }

      if (emoticonClasses) {
        emoticonNode.data.hProperties.class = emoticonClasses
      }

      eat(toEat)(emoticonNode)
    }
  }

  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.emoticons = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'emoticons')

  const Compiler = this.Compiler
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    if (!visitors) return
    visitors.emoticon = (node) => node.code
  }
}
