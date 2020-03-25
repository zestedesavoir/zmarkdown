const mdastRenderer = require('./renderers/mdast')
const htmlRenderer  = require('./renderers/html')

const mdastConfig   = require('./config/mdast')
const htmlConfig    = require('./config/html')

module.exports = (
  processor = null,
  tokenizerConfig = mdastConfig,
  processorConfig = htmlConfig,
) => {
  if (processor === 'html') {
    return (input, cb) => {
      const parser = mdastRenderer(tokenizerConfig)
      htmlRenderer(parser, processorConfig)

      if (typeof cb !== 'function') {
        return new Promise((resolve, reject) =>
          parser.process(input, (err, vfile) => {
            if (err) return reject(err)
  
            resolve(vfile)
          }))
      }
  
      parser.process(input, (err, vfile) => {
        if (err) return cb(err)
  
        cb(null, vfile)
      })
    }
  // No processor given: output syntax tree
  } else if (processor === null) {
    return input => mdastRenderer(tokenizerConfig).parse(input)
  // Custom processor: use it
  } else {
    const parser = mdastRenderer(tokenizerConfig)
    parser.use(processor, processorConfig)
  }
}
