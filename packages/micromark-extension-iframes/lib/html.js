import { sanitizeUri } from 'micromark-util-sanitize-uri'

export default {
  enter: {
    iframeLink: enterIframeLink
  },
  exit: {
    iframeLink: exitIframeLink
  }
}

function enterIframeLink () {
  this.buffer()
}

function exitIframeLink () {
  const iframeUrl = this.resume()
  const sanitizedUrl = sanitizeUri(iframeUrl)

  this.tag(`<iframe src="${sanitizedUrl}">`)
  this.tag('</iframe>')
}
