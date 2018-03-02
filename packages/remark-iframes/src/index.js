const {format, parse, URLSearchParams} = require('url')

module.exports = function plugin (opts) {
  if (typeof opts !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option')
  }

  function detectProvider (url) {
    const hostname = parse(url).hostname
    return opts[hostname]
  }

  function blockTokenizer (eat, value, silent) {
    if (!value.startsWith('!(http')) return

    let eatenValue = ''
    let url = ''
    const specialChars = ['!', '(', ')']
    for (let i = 0; i < value.length && value[i - 1] !== ')'; i++) {
      eatenValue += value[i]
      if (!specialChars.includes(value[i])) {
        url += value[i]
      }
    }

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    const provider = detectProvider(url)
    if (
      (!provider || provider.disabled === true) ||
      (provider.match && provider.match instanceof RegExp && !provider.match.test(url))
    ) {
      return eat(eatenValue)({
        type: 'paragraph',
        children: [{
          type: 'text',
          value: eatenValue,
        }],
      })
    }

    const finalUrl = computeFinalUrl(provider, url)
    const thumbnail = computeThumbnail(provider, finalUrl)
    eat(eatenValue)({
      type: 'iframe',
      src: url,
      data: {
        hName: provider.tag,
        hProperties: {
          src: finalUrl,
          width: provider.width,
          height: provider.height,
          allowfullscreen: true,
          frameborder: '0',
        },
        thumbnail: thumbnail,
      },
    })
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.iframes = blockTokenizer
  blockMethods.splice(blockMethods.indexOf('blockquote') + 1, 0, 'iframes')

  const Compiler = this.Compiler
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    if (!visitors) return
    visitors.iframe = (node) => `!(${node.src})`
  }
}

function computeFinalUrl (provider, url) {
  let finalUrl = url
  let parsed = parse(finalUrl)

  if (provider.droppedQueryParameters && parsed.search) {
    const search = new URLSearchParams(parsed.search)
    provider.droppedQueryParameters.forEach(ignored => search.delete(ignored))
    parsed.search = search.toString()
    finalUrl = format(parsed)
  }

  if (provider.replace && provider.replace.length) {
    provider.replace.forEach((rule) => {
      const [from, to] = rule
      if (from && to) finalUrl = finalUrl.replace(from, to)
      parsed = parse(finalUrl)
    })
    finalUrl = format(parsed)
  }

  if (provider.removeFileName) {
    parsed.pathname = parsed.pathname.substring(0, parsed.pathname.lastIndexOf('/'))
    finalUrl = format(parsed)
  }

  if (provider.removeAfter && finalUrl.includes(provider.removeAfter)) {
    finalUrl = finalUrl.substring(0, finalUrl.indexOf(provider.removeAfter))
  }

  if (provider.append) {
    finalUrl += provider.append
  }

  return finalUrl
}

function computeThumbnail (provider, url) {
  let thumbnailURL = ''
  const thumbnailConfig = provider.thumbnail
  if (thumbnailConfig && thumbnailConfig.format) {
    thumbnailURL = thumbnailConfig.format
    Object
      .keys(thumbnailConfig)
      .filter((key) => key !== 'format')
      .forEach((key) => {
        const search = new RegExp(`{${key}}`, 'g')
        const replace = new RegExp(thumbnailConfig[key]).exec(url)
        if (replace) thumbnailURL = thumbnailURL.replace(search, replace[1])
      })
  }
  return thumbnailURL
}
