const processorFactory = require('./processor-factory')
const manifest = require('../utils/manifest')
const io = require('../factories/io-factory')

module.exports = (givenProc, template) => (req, res, next) => {
  // Gather data about the request
  const rawContent = req.body.md
  const options = req.body.opts || {}

  const manifestRender = (typeof rawContent !== 'string')
  const useTemplate = (typeof template === 'function')
  const baseShift = options.heading_shift || 0

  // Increment endpoint usage for monitoring
  if (!useTemplate) io[givenProc]()
  else io['latex-document']()

  let extractPromises

  // Get a collection of Promises to execute
  if (manifestRender) {
    extractPromises = manifest
      .gatherExtracts(rawContent)
      .map(extract => {
        // Manifest rendering requires forging a new processor
        // to handle title depths
        const { text, options: localOptions } = extract
        if (localOptions.depth) {
          localOptions.heading_shift = baseShift + localOptions.depth
          localOptions.ic_shift = localOptions.depth
        }

        const mergedOptions = Object.assign({ enforce_shift: true }, options, localOptions)
        const processor = processorFactory(givenProc, mergedOptions)

        return processor(text)
      })
  } else {
    extractPromises = [processorFactory(givenProc, req.body.opts)(rawContent)]
  }

  Promise.all(extractPromises)
    .then(vfiles => {
      if (useTemplate) {
        let processedContent
        // When using the template, we need to assemble
        // the content first.
        if (manifestRender) processedContent = vfiles.reduce(manifest.assemble)
        else processedContent = vfiles[0]

        const templateOpts = Object.assign(options, {
          latex: processedContent.contents
        })
        const finalDocument = template(templateOpts)

        // Replace the content, and discard metadata, which have no meaning in LaTeX
        Object.assign(processedContent, { contents: finalDocument, data: {} })

        return processedContent
      }

      // Add parsed content to original manifest and return
      if (manifestRender) return manifest.dispatch(vfiles, rawContent)
      else return vfiles[0]
    })
    .then(vfile => res.json([vfile.contents, vfile.data, vfile.messages]))
    .catch(e => next(e))
}
