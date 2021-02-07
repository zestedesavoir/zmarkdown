const Sentry = require('@sentry/node')

const processorFactory = require('./processor-factory')
const io               = require('../factories/io-factory')

module.exports = (givenProc, template) => (req, res) => {
  // Increment endpoint usage for monitoring
  if (!template) io[givenProc]()
  else io['latex-document']()

  const processor = processorFactory(givenProc, req.body.opts)

  function sendResponse (e, vfile) {
    if (e) {
      Sentry.captureException(e, {req, vfile})
      res.status(500).json(vfile)
      return
    }

    res.json([vfile.contents, vfile.data, vfile.messages])
  }

  // First parse the document
  processor(req.body.md, (e, vfile) => {
    // Apply the template if necessary
    if (!e && typeof template === 'function') {
      const templateOpts = Object.assign(req.body.opts, {latex: vfile.contents})

      try {
        const doc = template(templateOpts)

        // Replace the content, and discard metadata, which have no meaning in LaTeX
        Object.assign(vfile, {contents: doc, data: {}})
      } catch (e) {
        return sendResponse(e)
      }
    }

    sendResponse(e, vfile)
  })
}
