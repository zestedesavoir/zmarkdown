const urlParse = require('url').parse

module.exports = function inlinePlugin (opts = {}) {
  function extractProvider (url) {
    const hostname = urlParse(url).hostname
    return opts[hostname]
  }
  function computeFinalUrl (provider, url) {
    let finalUrl = url
    if (provider.replace) {
      for (const key in provider.replace) {
        finalUrl = finalUrl.replace(key, provider.replace[key])
      }
    }
    if (provider.removeFileName) {
      finalUrl = finalUrl.substring(0, finalUrl.lastIndexOf('/'))
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
    if (silent) {
      return url.length > 0
    }
    const provider = extractProvider(url)
    if (!provider) {
      return false
    } else if (provider.enabled === false ||
      (provider.domain && provider.domain.match && !provider.domain.match.exec(url))) {
      eat(eatenValue)({
        type: 'text',
        value: eatenValue
      })
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
