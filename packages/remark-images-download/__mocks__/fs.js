const fs = jest.genMockFromModule('fs')

fs.stat = (path, callback) => {
  const err = null
  const stats = {
    isDirectory () {
      return true
    }
  }
  process.nextTick(() => callback(err, stats))
}

fs.mkdir = (path, callback) => {
  process.nextTick(() => callback())
}

module.exports = fs
