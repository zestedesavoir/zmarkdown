const defaultMdastConfig  = require('../../config/mdast')
const configFactory       = require('./config-factory')
const zmd                 = require('../../common')

// ZMd parser memoization
const processors = {}

module.exports = (processor, opts = {}, bypassHeadingShift = false) => {
  if (!['epub', 'html', 'latex'].includes(processor)) {
    return (md, cb) => cb(new Error(`Unknown target '${processor}'`))
  }

  if (processor === 'html') {
    if (!bypassHeadingShift) opts.heading_shift = 2
    opts.disable_images_download = true
  }

  if (processor === 'latex') {
    if (!bypassHeadingShift) opts.heading_shift = 0
    opts.disable_ping = true
    opts.disable_jsfiddle = true
  }

  if (processor === 'epub') {
    if (!bypassHeadingShift) opts.heading_shift = 2
    opts.disable_ping = true
    opts.disable_jsfiddle = true
    opts.inline = false

    // EPub is HTML
    processor = 'html'
  }

  const procId = processor + JSON.stringify(opts)

  if (!processors.hasOwnProperty(procId)) {
    // Merge new config with defaults
    const mdastConfig = Object.assign(
      {},
      defaultMdastConfig,
      configFactory(opts),
    )

    processors[procId] = zmd(processor, mdastConfig)
  }

  return processors[procId]
}
