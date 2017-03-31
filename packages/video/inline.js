const regexp = /!\((https?:\/\/[a-zA-Z0-9_./?=&%-]+)\)/

module.exports = (providers) => function inlinePlugin (opts = {}) {
  function extractProvider (url) {
    const endOfProtocoleIndex = url.indexOf('//') + 2
    const endOfDomainIndex = url.substring(endOfProtocoleIndex).indexOf('/') + endOfProtocoleIndex
    console.log("url", url.substring(endOfProtocoleIndex, endOfDomainIndex))
    return providers[url.substring(endOfProtocoleIndex, endOfDomainIndex)]
  }
  function locator (value, fromIndex) {
    const found = regexp.exec(value.substring(fromIndex))
    return found === null ? -1 : found.index
  }

  function inlineTokenizer (eat, value, silent) {
    const found = regexp.exec(value)
    console.log("LOG" + found)
    if (found === null || found.index !== 0 || silent) {
      console.log("GOT HERE" + found)
      return silent
    }
    const provider = extractProvider(found[1])
    if (!provider || provider.activated === false) {
      console.log("provider" + provider)
      return false
    }
    console.log(found[0], found[1], found[found.length - 1])
    eat(value)({
      type: 'video',
      data: {
        hName: provider.tag,
        hProperties: {
          src: found[1],
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
