const fs = require('fs')
const path = require('path')
const request = require('request')
const shortid = require('shortid')
const url = require('url')

module.exports = image
const defaultInline = (node) => `\\inlineImage{${node.url}}`
const defaultMacro = (node) => {
  const width = node.width ? `[width=${node.width}]` : ''
  return `\\includeGraphics${width}{${node.url}}`
}

function downloadImage (uri, destination, maxlength) {
  request.head(uri, function (err, res, body) {
    if (!err &&
      res.headers['content-type'].substring(0, 6) === 'image/' &&
      (!maxlength || res.headers['content-length'] < maxlength)) {
      request(uri).pipe(fs.createWriteStream(destination))
    }
  })
}

function image (ctx, node, _, parent) {
  let macro = ctx.image ? ctx.image : defaultMacro
  if (ctx.downloadImage) {
    const parserdUri = url.parse(node.url)
    if (parserdUri.hostname) {
      const destinationDir = ctx.destination ? ctx.destination : './'
      const extension = path.extname(parserdUri.pathname)
      const destination = `${destinationDir}${shortid.generate()}.${extension}`
      downloadImage(node.url, destination, ctx.maxlength)
      node.url = destination
    }
  }
  if (parent.type === 'paragraph' && parent.children.length - 1) {
    macro = ctx.inlineImage ? ctx.inlineImage : defaultInline
  }
  return macro(node)
}
