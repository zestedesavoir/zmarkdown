const visit = require('unist-util-visit')
const fs = require('fs')
const path = require('path')
const request = require('request')
const shortid = require('shortid')
const url = require('url')

function plugin (opts) {
  return (tree) => {
    const sizeAllFiles = {sum: 0}
    if (opts && opts.downloadImage) {
      return new Promise(function (resolve, reject) {
        // images are downloaded in destinationPath
        const destinationDir = opts.downloadDestination ? opts.downloadDestination : './'
        const destinationPath = path.join(destinationDir, shortid.generate())
        if (!fs.existsSync(destinationPath)) {
          fs.mkdirSync(destinationPath)
        }

        visit(tree, 'image', function (node) {
          const parserdUri = url.parse(node.url)
          if (parserdUri.hostname) {
            const extension = path.extname(parserdUri.pathname)
            const basename = `${shortid.generate()}.${extension}`
            const destination = path.join(destinationPath, basename)
            downloadImage(node.url, destination, opts.maxFileLength,
              sizeAllFiles, opts.dirSizeLimit)
            node.url = destination
          }
        })
      })
    }
  }
}

function downloadImage (uri, destination, maxFileLength, sizeAllFiles, dirSizeLimit) {
  request.head(uri, function (err, res, body) {
    if (!err &&
      res.headers['content-type'].substring(0, 6) === 'image/' &&
      (!maxFileLength || res.headers['content-length'] < maxFileLength)) {

      // Check if the directory size limit is reached before downloading
      sizeAllFiles.sum += parseInt(res.headers['content-length'])
      if (!dirSizeLimit || sizeAllFiles.sum < dirSizeLimit) {
        request(uri).pipe(fs.createWriteStream(destination))
      }
    }
  })
}

module.exports = plugin
