const toVFile = require('to-vfile')
const clone = require('clone')
const rebberStringify = require('rebber/src')
const zmarkdown = require('./common')

const fromFile = (filepath) => toVFile.readSync(filepath)

const remarkConfig = require('./config/remark')
let zmd

function getLatexProcessor (remarkConfig, rebberConfig) {
  remarkConfig.noTypography = true
  return zmd.zmdParser(remarkConfig)
    .use(rebberStringify, rebberConfig)
}

function rendererFactory (zmd, remarkConfig, extraPlugins, target) {
  if (target === 'html') {
    return zmd.rendererFactory(remarkConfig, extraPlugins)
  } else if (target === 'latex') {
    return zmd.rendererFactory(remarkConfig, extraPlugins, getLatexProcessor)
  }
  throw new Error(`Unknown target: ${target}`)
}

module.exports = (
  opts = {remarkConfig},
  target = 'html'
) => {
  if (!opts.remarkConfig || !Object.keys(remarkConfig).length) {
    opts.remarkConfig = clone(remarkConfig)
  }

  zmd = zmarkdown(opts)
  zmd.renderString = rendererFactory(zmd, opts.remarkConfig, opts.extraPlugins, target)
  zmd.renderFile = (path, cb) => {
    return rendererFactory(zmd, opts.remarkConfig, opts.extraPlugins, target)(fromFile(path), cb)
  }

  return zmd
}
