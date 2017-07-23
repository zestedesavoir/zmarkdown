const visit = require('unist-util-visit')
const fs = require('fs')
const path = require('path')
const request = require('request-promise')
const shortid = require('shortid')
const url = require('url')

const writeFile = (file, data, options) => new Promise((resolve, reject) => {
  fs.writeFile(file, data, options, (err) => {
    if (err) reject()
    resolve()
  })
})

const mkdir = (path) => new Promise((resolve, reject) => {
  fs.stat(path, (err, stats) => {
    if (err) {
      return fs.mkdir(path, (err) => {
        if (err) reject(new Error(`Failed to create dir ${path}`))
        resolve()
      })
    }
    if (!stats.isDirectory()) {
      reject(new Error(`${path} is not a directory!`))
    }
    resolve()
  })
})

function plugin ({
  downloadImages = true,
  maxFileLength = 1000000,
  dirSizeLimit = 10000000,
  downloadDestination = './',
  report = console.error
} = {}) {
  return function transform (tree) {
    if (downloadImages !== true) return
    let totalDownloadedSize = 0

    // images are downloaded in destinationPath
    const destinationPath = path.join(downloadDestination, shortid.generate())

    return mkdir(destinationPath)
      .then(() => {
        const promises = [Promise.resolve()]

        visit(tree, 'image', function (node) {
          const parsedURI = url.parse(node.url)

          if (parsedURI.host) {
            const extension = path.extname(parsedURI.pathname)
            const basename = `${shortid.generate()}.${extension}`
            const destination = path.join(destinationPath, basename)
            const imageURL = node.url

            promises.push(
              downloadImage(imageURL, destination)
                .then((imageSize) => {
                  totalDownloadedSize += imageSize
                  node.url = destination
                })
                .catch((err) => report(err, `while downloading ${imageURL}`)))
          }
        })

        return Promise.all(promises)
      })
      .catch((err) => report(err))
      .then(() => tree)

    function isDownloadable (uri, callback) {
      return request.head(uri)
        .then((res) => new Promise((resolve, reject) => {
          if (res.headers['content-type'].substring(0, 6) !== 'image/') {
            reject(new Error(`Content-Type of ${uri} is not of image/ type`))
          }

          const fileSize = parseInt(res.headers['content-length'], 10)

          if (maxFileLength && fileSize > maxFileLength) {
            reject(new Error(
              `File at ${uri} weighs ${res.headers['content-length']} ` +
              `bigger than ${maxFileLength}`))
          }

          if (dirSizeLimit && totalDownloadedSize >= dirSizeLimit) {
            reject(new Error(
              `Cannot download ${uri} because destination directory reached size limit`))
          }
          resolve()
        }))
    }

    function downloadImage (uri, destination) {
      return isDownloadable(uri)
        .catch((notDownloadable) => report(notDownloadable))
        .then(() => request(uri))
        .then((res, body) => writeFile(destination, body).then(() => res))
        .then((response) => parseInt(response.headers['content-length'], 10))
    }
  }
}

module.exports = plugin
