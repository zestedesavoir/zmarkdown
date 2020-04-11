const mdastRenderer = require('./renderers/mdast')
const htmlRenderer  = require('./renderers/html')
const latexRenderer = require('./renderers/latex')

const mdastConfig   = require('./config/mdast')
const htmlConfig    = require('./config/html')

module.exports = (
  processor = null,
  tokenizerConfig = mdastConfig,
  processorConfig = htmlConfig,
) => {
  const parser = mdastRenderer(tokenizerConfig)

  if (processor === 'html') {
    htmlRenderer(parser, processorConfig)
  } else if (processor === 'latex') {
    latexRenderer(parser, processorConfig)
  // No processor given: output syntax tree
  } else if (processor === null) {
    return input => mdastRenderer(tokenizerConfig).parse(input)
  // Custom processor: use it
  } else {
    parser.use(processor, processorConfig)
  }

  return (input, cb) => {
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
}
