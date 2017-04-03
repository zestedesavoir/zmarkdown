const regexp = /!\((https?:\/\/[a-zA-Z0-9_./?=&%-]+)\)/

module.exports = (providers) => function inlinePlugin (opts = {}) {
  function extractProvider (url) {
    const endOfProtocoleIndex = url.indexOf('//') + 2
    const endOfDomainIndex = url.substring(endOfProtocoleIndex).indexOf('/') + endOfProtocoleIndex
    return providers[url.substring(endOfProtocoleIndex, endOfDomainIndex)]
  }
  function computeFinalUrl(provider, url) {
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
    const found = regexp.exec(value.substring(fromIndex))
    return found === null ? -1 : found.index
  }
  function inlineTokenizer (eat, value, silent) {
    const found = regexp.exec(value)
    if (found === null || found.index !== 0 || silent) {
      return silent
    }
    const provider = extractProvider(found[1])
    if (!provider || provider.activated === false) {
      return false
    }
    console.log(found[0], found[1], found[found.length - 1])
    eat(found[0])({
      type: 'video',
      data: {
        hName: provider.tag,
        hProperties: {
          src: computeFinalUrl(provider, found[1]),
          width: provider.width,
          height: provider.height,
          allowfullscreen: 'true',
          frameborder: '0'
        }
      }
    })
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.video = inlineTokenizer
  inlineMethods.unshift('video')
}
