const clone = require('clone')
const zmarkdown = require('../')
const remarkConfig = require('../config/remark')
const rebberConfig = require('../config/rebber')
const defaultConfig = {remarkConfig, rebberConfig}

// this object is used to memoize processors
const processors = {}

module.exports = function markdownHandlers (Raven) {
  return {
    toHTML,
    toLatex,
    toLatexDocument,
  }

  function toHTML (markdown, opts = {}, callback) {
    if (typeof markdown !== 'string') markdown = String(markdown)

    /* zmd parser memoization */
    const key = `toHTML${JSON.stringify(opts)}`
    if (!processors.hasOwnProperty(key)) {
      const config = clone(defaultConfig)

      config.remarkConfig.headingShifter = 2

      /* presets */
      if (opts.disable_ping === true) {
        config.remarkConfig.ping.pingUsername = () => false
      }

      if (opts.disable_jsfiddle === true) {
        config.remarkConfig.iframes['jsfiddle.net'].disabled = true
        config.remarkConfig.iframes['www.jsfiddle.net'].disabled = true
      }

      if (opts.inline === true) {
        config.remarkConfig.disableTokenizers = {
          block: [
            'indentedCode',
            'fencedCode',
            'blockquote',
            'atxHeading',
            'setextHeading',
            'footnote',
            'table',
            'custom_blocks'
          ]
        }
      }

      processors[key] = zmarkdown(config, 'html')
    }

    processors[key].renderString(String(markdown), (err, {contents, data, messages} = {}) => {
      const metadata = data

      if (err) {
        Raven.mergeContext({
          extra: {
            zmdConfig: makeSerializable(processors[key].config),
            markdown: markdown,
            zmdOutput: {
              contents: contents,
              metadata: metadata,
              messages: messages,
            }
          }
        })
        return callback(err, markdown)
      }

      callback(null, [contents, metadata, messages])
    })
  }

  function toLatex (markdown, opts = {}, callback) {
    if (typeof markdown !== 'string') markdown = String(markdown)

    /* zmd parser memoization */
    const key = `toLatex${JSON.stringify(opts)}`
    if (!processors.hasOwnProperty(key)) {
      const config = clone(defaultConfig)

      config.remarkConfig.headingShifter = 0
      config.remarkConfig.ping.pingUsername = () => false

      if (opts.disable_jsfiddle === true) {
        config.remarkConfig.iframes['jsfiddle.net'].disabled = true
        config.remarkConfig.iframes['www.jsfiddle.net'].disabled = true
      }

      config.remarkConfig.imagesDownload.disabled = opts.disable_images_download === true
      if (opts.images_download_dir) {
        config.remarkConfig.imagesDownload.downloadDestination = opts.images_download_dir
      }

      processors[key] = zmarkdown(config, 'latex')
    }

    processors[key].renderString(String(markdown), (err, {contents, data, messages} = {}) => {
      const metadata = data

      if (err) {
        Raven.mergeContext({
          extra: {
            zmdConfig: makeSerializable(processors[key].config),
            markdown: markdown,
            zmdOutput: {
              contents: contents,
              metadata: metadata,
              messages: messages,
            }
          }
        })
        return callback(err, markdown)
      }

      callback(null, [contents, metadata, messages])
    })
  }

  function toLatexDocument (markdown, opts = {}, callback) {
    toLatex(markdown, opts, (err, [contents, metadata, messages] = []) => {
      if (err) {
        Raven.mergeContext({
          extra: {
            zmdConfig: makeSerializable(opts),
            markdown: markdown,
            zmdOutput: {
              contents: contents,
              metadata: metadata,
              messages: messages,
            }
          }
        })
        return callback(err, markdown)
      }

      const {
        contentType,
        title,
        authors,
        license,
        licenseDirectory,
        smileysDirectory,
        disableToc,
        latex = contents,
      } = opts
      try {
        const latexDocument = zmarkdown().latexDocumentTemplate({
          contentType,
          title,
          authors,
          license,
          licenseDirectory,
          smileysDirectory,
          disableToc,
          latex,
        })
        return callback(null, [latexDocument, {}])
      } catch (e) {
        Raven.captureException(e)
        return callback(e)
      }
    })
  }
}

function makeSerializable (obj) {
  return JSON.parse(JSON.stringify(obj))
}
