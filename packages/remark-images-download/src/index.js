const visit = require('unist-util-visit')
const fs = require('fs')
const {map} = require('async')
const path = require('path')
const request = require('request-promise')
const shortid = require('shortid')
const url = require('url')
const {promisify} = require('util')

const writeFile = promisify(fs.writeFile)

function plugin ({
  downloadImages = true,
  maxFileLength = 1000000,
  dirSizeLimit = 10000000,
  downloadDestination = './'
} = {}) {
  return (tree) => {
    if (downloadImages !== true) return

    const sizeAllFiles = {sum: 0}

    // images are downloaded in destinationPath
    const destinationPath = path.join(downloadDestination, shortid.generate())
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath)
    }

    const promises = []
    let totalDownloadedSize = 0

    visit(tree, 'image', function (node) {
      const parsedURI = url.parse(node.url)
      if (parsedURI.hostname) {
        const extension = path.extname(parsedURI.pathname)
        const basename = `${shortid.generate()}.${extension}`
        const destination = path.join(destinationPath, basename)
        const imageURL = node.url

        promises.push(
          downloadImage(imageURL, destination)
            .catch((err) => console.error(err, `while downloading ${imageURL}`))
            .then((imageSize) => {
              totalDownloadedSize += imageSize
              node.url = destination
            }))
      }
    })

    return Promise.all(promises)

    function isDownloadable (uri, callback) {
      return Promise((resolve, reject) => {
        request.head(uri, (err, res) => {
          if (err) reject(err)

          if (res.headers['content-type'].substring(0, 6) !== 'image/') {
            reject(new Error(`Content-Type of ${uri} is not of image/ type`))
          }

          const fileSize = parseInt(res.headers['content-length'], 10)

          if (maxFileLength && fileSize > maxFileLength) {
            reject(new Error(
              `File at ${uri} weighs ${res.headers['content-length']}` +
              `bigger than ${maxFileLength}`))
          }

          if (dirSizeLimit && totalDownloadedSize >= dirSizeLimit) {
            reject(new Error(
              `Cannot download ${uri} because destination directory reached size limit`))
          }

          resolve()
        })
      })
    }

    function downloadImage (uri, destination) {
      return Promise((resolve, reject) => {
        isDownloadable(uri)
          .catch(err => reject(err))
          .then(() => request(uri))
          .then((res, body) => writeFile(destination, body).then(() => res))
          .then((response) => resolve(parseInt(response.headers['content-length'], 10)))
          .catch(err => reject(err))
      })
    }
  }
}

module.exports = plugin
