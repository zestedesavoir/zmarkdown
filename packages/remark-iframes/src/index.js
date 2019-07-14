const {format, parse, URLSearchParams} = require('url')
const http = require('http')
const https = require('https')

const makeHttpRequest = async url =>
  new Promise((resolve, reject) => {
    const parsedUrl = parse(url)
    const client = (parsedUrl.protocol === 'https:') ? https : http

    const options = Object.assign(
      {},
      parsedUrl,
      {timeout: 3000}
    )

    const req = client.get(options, res => {
      const {statusCode} = res

      if (statusCode !== 200) {
        req.abort()
        res.resume()
        reject(new Error(`Received HTTP ${statusCode} for: ${url}`))
      } else {
        res.setEncoding('utf8')

        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })

        res.on('end', () => {
          let oembedRes

          try {
            oembedRes = JSON.parse(rawData)
          } catch (e) {
            reject(e)
          }

          const oembedUrl = oembedRes.html.match(/src="([A-Za-z0-9_/?&=:.]+)"/)[1]
          const oembedThumbnail = oembedRes.thumbnail_url

          resolve({
            url: oembedUrl,
            thumbnail: oembedThumbnail,
            width: oembedRes.width,
            height: oembedRes.height,
          })
        })
      }
    })

    req.on('timeout', () => {
      req.abort()
      reject(new Error(`Request timed out for: ${url}`))
    })

    req.on('error', e => reject(e))
  })

module.exports = function plugin (opts) {
  if (typeof opts !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option')
  }

  function detectProvider (url) {
    const hostname = parse(url).hostname
    return opts[hostname]
  }

  async function blockTokenizer (eat, value, silent) {
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

    let finalUrl, thumbnail, fallback

    if (provider.oembed) {
      const reqUrl = `${provider.oembed}?format=json&url=${encodeURIComponent(url)}`

      await makeHttpRequest(reqUrl).then((oembedRes) => {
        finalUrl = oembedRes.url
        thumbnail = oembedRes.thumbnail

        if (!provider.height) provider.height = oembedRes.height
        if (!provider.width) provider.width = oembedRes.width
        if (!provider.tag) provider.tag = 'iframe'
      }, (e) => {
        fallback = true
      })
    } else {
      finalUrl = computeFinalUrl(provider, url)
      thumbnail = computeThumbnail(provider, finalUrl)
    }

    if (!fallback) {
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
    } else {
      eat(eatenValue)({
        type: 'link',
        url: url,
        children: [{type: 'text', value: url}],
      })
    }
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
