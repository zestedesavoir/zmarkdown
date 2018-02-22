const fileType = require('file-type')
const fs = require('fs')
const isSvg = require('is-svg')
const path = require('path')
const request = require('request')
const shortid = require('shortid')
const URL = require('url')
const visit = require('unist-util-visit')

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

const checkAndCopy = (from, to) =>
  new Promise((resolve, reject) => {
    fs.readFile(from, (err, data) => {
      if (err) reject(err)
      if (!data) {
        return reject(new Error(`Empty file: ${from}`))
      }
      const type = fileType(data) || {mime: ''}
      if (!type.mime || type.mime === 'application/xml') {
        if (!isSvg(data)) {
          return reject(new Error(`Could not detect ${from} mime type, not SVG either`))
        }
      } else if (type.mime.slice(0, 6) !== 'image/') {
        return reject(new Error(
          `Detected mime of local file '${from}' is not an image/ type`))
      }
      fs.copyFile(from, to, (err) => {
        if (err) return reject(new Error(`Failed to copy ${from} to ${to}`))

        resolve()
      })
    })
  })

function plugin ({
  disabled = false,
  maxFileSize = 1000000,
  dirSizeLimit = 10000000,
  downloadDestination = '/tmp',
  localUrlToLocalPath,
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
          const {url, position} = node
          const parsedURI = URL.parse(url)

          const extension = path.extname(parsedURI.pathname)
          const filename = `${shortid.generate()}${extension}`
          const destination = path.join(destinationPath, filename)

          if (!parsedURI.host) {
            let localPath
            if (typeof localUrlToLocalPath === 'function') {
              localPath = localUrlToLocalPath(url)
            } else if (Array.isArray(localUrlToLocalPath) && localUrlToLocalPath.length === 2) {
              const [from, to] = localUrlToLocalPath
              localPath = url.replace(new RegExp(`^${from}`), to)
            } else {
              return
            }

            if (localPath.includes('../')) {
              vfile.message(`Dangerous absolute image URL detected: ${localPath}`, position, url)
              return
            }

            const promise = checkAndCopy(localPath, destination)
              .then(() => {
                node.url = destination
              }, (err) => {
                vfile.message(err, position, url)
              })

            promises.push({offset: position.offset, promise: promise})
            return
          }

          const promise = new Promise((resolve, reject) => {
            if (!['http:', 'https:'].includes(parsedURI.protocol)) {
              reject(`Protocol '${parsedURI.protocol}' not allowed.`)
            }

            const writeStream = (destination) => {
              return fs
                .createWriteStream(destination)
                .on('close', () => {
                  node.url = destination
                  resolve()
                })
            }

            request
              .get(url, (err) => {
                if (err) reject(err)
              })
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
                res.once('data', (chunk) => {
                  const type = fileType(chunk) || {mime: ''}
                  if (type.mime.slice(0, 6) !== 'image/' && !isSvg(chunk.toString())) {
                    if (type.mime) {
                      reject(new Error(`Mime of ${url} not allowed: '${type.mime}'`))
                    } else {
                      reject(new Error(`Could not detect ${url} mime type, not SVG either`))
                    }
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
          .map((a) => a.promise)
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
