function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
}

const SPACE = ' '

module.exports = function inlinePlugin (emoticons = {}) {
  const pattern = Object.keys(emoticons).map(escapeRegExp).join('|')

  if (!pattern) {
    throw new Error('remark-emoticons needs to be passed a configuration object as option')
  }

  const regex = new RegExp(`(\\s|^)(${pattern})(\\s|$)`)

  function locator (value, fromIndex) {
    const keep = regex.exec(value)
    if (keep) {
      if (value[keep.index] === SPACE) {
        return keep.index + 1
      }
      return keep.index
    }
    return -1
  }

  function inlineTokenizer (eat, value, silent) {
    const keep = regex.exec(value)
    if (keep) {
      if (keep.index !== 0) return true

      /* istanbul ignore if - never used (yet) */
      if (silent) return true

      let emoticon = keep[0]
      if (emoticon.charAt(emoticon.length - 1) === SPACE) {
        emoticon = emoticon.substring(0, emoticon.length - 1)
      }

      eat(emoticon)({
        type: 'image',
        url: emoticons[emoticon],
        alt: emoticon
      })
    }
  }

  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.emoticons = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'emoticons')
}
