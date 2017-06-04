const URL = require('url')
const urlParse = URL.parse

module.exports = function plugin (opts) {
  if (typeof opts !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option')
  }

  function extractProvider (url) {
    const hostname = urlParse(url).hostname
    return opts[hostname]
  }
  function computeFinalUrl (provider, url) {
    let finalUrl = url
    if (provider.replace && provider.replace.length) {
      provider.replace.forEach((rule) => {
        const [from, to] = rule
        if (from && to) finalUrl = finalUrl.replace(from, to)
      })
    }
    if (provider.removeFileName) {
      const parsed = urlParse(finalUrl)
      parsed.pathname = parsed.pathname.substring(0, parsed.pathname.lastIndexOf('/'))
      finalUrl = URL.format(parsed)
    }
    if (provider.append) {
      finalUrl += provider.append
    }
    if (provider.removeAfter && finalUrl.indexOf(provider.removeAfter) !== -1) {
      finalUrl = finalUrl.substring(0, finalUrl.indexOf(provider.removeAfter))
    }
    return finalUrl
  }
  function locator (value, fromIndex) {
    return value.indexOf('!(http', fromIndex)
  }
  function inlineTokenizer (eat, value, silent) {
    let eatenValue = ''
    let url = ''
    for (let i = 0; i < value.length && value[i - 1] !== ')'; i++) {
      eatenValue += value[i]
      if (value[i] !== '!' && value[i] !== '(' && value[i] !== ')') {
        url += value[i]
      }
    }

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    const provider = extractProvider(url)

    if (
      (!provider || provider.disabled === true) ||
      (provider.match && provider.match instanceof RegExp && !provider.match.test(url))
    ) {
      if (eatenValue.startsWith('!(http')) {
        eat(eatenValue)({
          type: 'text',
          value: eatenValue
        })
      } else {
        return
      }
    } else {
      eat(eatenValue)({
        type: 'iframe',
        data: {
          hName: provider.tag,
          hProperties: {
            src: computeFinalUrl(provider, url),
            width: provider.width,
            height: provider.height,
            allowfullscreen: true,
            frameborder: '0'
          }
        }
      })
    }
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.iframes = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('autoLink'), 0, 'iframes')
}
