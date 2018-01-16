const visit = require('unist-util-visit')
const fs = require('fs')
const path = require('path')
const request = require('request')
const shortid = require('shortid')
const fileType = require('file-type')
const URL = require('url')

const noop = Promise.resolve()

const isImage = (headers = {}) =>
  (headers['content-type'].substring(0, 6) === 'image/')

const getSize = (headers = {}) =>
  parseInt(headers['content-length'], 10)

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
  disabled = false,
  maxFileSize = 1000000,
  dirSizeLimit = 10000000,
  downloadDestination = '/tmp'
} = {}) {
  return function transform (tree, vfile) {
    if (disabled) return noop
    let totalDownloadedSize

    // images are downloaded to destinationPath
    const destinationPath = path.join(downloadDestination, shortid.generate())

    vfile.data.imageDir = destinationPath

    return mkdir(destinationPath)
      .then(() => {
        totalDownloadedSize = 0
        const promises = [{offset: -1, promise: noop}]

        visit(tree, 'image', (node) => {
          const { url, position } = node
          const parsedURI = URL.parse(url)

          if (!parsedURI.host) return

          const extension = path.extname(parsedURI.pathname)
          const filename = `${shortid.generate()}${extension}`
          const destination = path.join(destinationPath, filename)

          const promise = new Promise((resolve, reject) => {

            const writeStream = (destination) => {
              return fs
                .createWriteStream(destination)
                .on('close', () => {
                  node.url = destination
                  resolve()
                })
            }

            request
              .get(url)
              .on('response', ({headers, statusCode} = {}) => {
                if (statusCode !== 200) {
                  reject(new Error(`Received HTTP${statusCode} for: ${url}`))
                }
                if (!isImage(headers)) {
                  reject(new Error(`Content-Type of ${url} is not an image/ type`))
                }

                const fileSize = getSize(headers)
                if (maxFileSize && fileSize > maxFileSize) {
                  reject(new Error(
                    `File at ${url} weighs ${headers['content-length']}, ` +
                    `max size is ${maxFileSize}`))
                }

                if (dirSizeLimit && (totalDownloadedSize + fileSize) >= dirSizeLimit) {
                  reject(new Error(
                    `Cannot download ${url} because destination directory reached size limit`))
                }

                totalDownloadedSize += fileSize
              })
              .on('response', (res) => {
                res.once('data', chunk => {
                  res.destroy()
                  const type = fileType(chunk) || {mime: ''}
                  if (type.mime.slice(0, 6) !== 'image/') {
                    reject(new Error(
                      `Detected mime of ${url} is not an image/ type`))
                  }
                })
              })
              .on('error', (err) => {
                reject(err)
              })
              .pipe(writeStream(destination))
          }).catch((err) => {
            vfile.message(err, position, url)
          })

          promises.push({offset: position.offset, promise: promise})
        })

        // Use offsets to ensure execution order
        // we don't want to download them in (possibly) random order.
        // More importantly: this makes tests stable.
        promises.sort((a, b) => b.offset - a.offset)

        return promises
          .map(a => a.promise)
          .reduce(
            (chain, currentTask) =>
              chain.then(chainResults =>
                currentTask.then(currentResult =>
                  [...chainResults, currentResult])),
            Promise.resolve([]))
      })
      .catch((err) => {
        vfile.message(err)
      })
      .then(() => tree)
  }
}

module.exports = plugin
