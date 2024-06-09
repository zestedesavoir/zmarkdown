import fetch from 'node-fetch'
import { sanitizeUri } from 'micromark-util-sanitize-uri'

const protocolIframe = /^https?$/i

function urlChecker (url) {
  const sanitizedUrl = sanitizeUri(url, protocolIframe)

  try {
    const parsedUrl = new URL(sanitizedUrl)

    return { url: sanitizedUrl, host: parsedUrl.hostname }
  } catch (e) {}
}

export default function embedRequest (iframeUrl, providers) {
  return new Promise((resolve, reject) => {
    // Make a list of valid domains
    const validDomains = providers
      .filter(p => p.disabled === false)
      .map(p => p.hostname)
      .flat()

    // Check if URL is valid
    const checkedUrl = urlChecker(iframeUrl)
    if (!checkedUrl) return reject(new Error('Embed URL is invalid'))

    // Check if URL has a valid provider
    if (!validDomains.includes(checkedUrl.host)) return reject(new Error('Embed host is not supported'))

    const provider = providers
      .find(p => p.hostname.includes(checkedUrl.host))
    if (!provider) return reject(new Error('Embed host is not supported'))

    if (provider.match && provider.match instanceof RegExp && !provider.match.test(checkedUrl.url)) {
      return reject(Error('Embed URL did not match'))
    }

    if (provider.transformer && typeof provider.transformer === 'function') {
      checkedUrl.url = provider.transformer(checkedUrl.url)
    }

    return resolve({
      url: checkedUrl.url,
      provider
    })
  })
    .then(({ url, provider }) => {
      // If oembed hasn't been provided, use the transformed link
      if (!provider.oembed) {
        let thumbnail

        if (provider.thumbnail) {
          if (typeof provider.thumbnail === 'function') {
            thumbnail = provider.thumbnail(url)
          } else {
            thumbnail = provider.thumbnail
          }
        }

        return {
          url,
          thumbnail,
          width: provider.width,
          height: provider.height
        }
      }

      // Make oEmbed request
      const reqUrl = new URL(provider.oembed)
      reqUrl.searchParams.append('format', 'json')
      reqUrl.searchParams.append('url', url)

      // Abort after timeout
      const aController = new AbortController()
      const aTimeout = setTimeout(() => { aController.abort() }, 1500)

      return fetch(reqUrl.toString(), { signal: aController.signal })
        .then(res => res.json())
        .then(oembedRes => {
          const oembedUrl = oembedRes.html.match(/src="(.+?)"/)[1]
          const oembedThumbnail = oembedRes.thumbnail_url

          return {
            url: oembedUrl,
            thumbnail: oembedThumbnail,
            width: provider.width || oembedRes.width,
            height: provider.height || oembedRes.height,
            lazyLoad: provider.lazyLoad
          }
        })
        .finally(() => { clearTimeout(aTimeout) })
    })
}
