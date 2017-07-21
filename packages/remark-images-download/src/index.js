const visit = require('unist-util-visit')
const fs = require('fs')
const path = require('path')
const request = require('request')
const shortid = require('shortid')
const url = require('url')

function plugin (opts) {
  return (tree) => {
    if (opts && opts.downloadImage) {
      // images are downloaded in destinationPath
      let destinationDir = opts.downloadDestination ? opts.downloadDestination : './'
      if (destinationDir.slice(-1) !== '/') destinationDir += '/'
      const destinationPath = `${destinationDir}${shortid.generate()}`
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath)
      }

      visit(tree, 'image', function (node) {
        const parserdUri = url.parse(node.url)
        if (parserdUri.hostname) {
          const extension = path.extname(parserdUri.pathname)
          const basename = `${shortid.generate()}.${extension}`
          const destination = `${destinationPath}/${basename}`
          downloadImage(node.url, destination, opts.maxlength)
          node.url = destination
        }
      })
    }
  }
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

module.exports = plugin
