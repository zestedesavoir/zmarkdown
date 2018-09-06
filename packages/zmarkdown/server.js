const toVFile = require('to-vfile')
const clone = require('clone')

const remarkImagesDownload = require('remark-images-download/src')

const rebberStringify = require('rebber/src')
const rebberConfig = require('./config/rebber')
const zmarkdown = require('./common')

const fromFile = (filepath) => toVFile.readSync(filepath)

const remarkConfig = require('./config/remark')
let zmd

function getLatexProcessor (config) {
  config.remarkConfig.noTypography = true

  return zmd.zmdParser(config.remarkConfig, config.extraPlugins)
    .use(rebberStringify, config.rebberConfig)
}

function rendererFactory (config, target) {
  if (target === 'html') {
    return zmd.rendererFactory(config)
  } else if (target === 'latex') {
    return zmd.rendererFactory(config, getLatexProcessor)
  }
  throw new Error(`Unknown target: ${target}`)
}

module.exports = (
  opts = {remarkConfig, rebberConfig},
  target = 'html'
) => {
  if (!opts.remarkConfig || !Object.keys(remarkConfig).length) {
    opts.remarkConfig = clone(remarkConfig)
  }

  if ((target === 'latex') && (!opts.remarkConfig || !Object.keys(remarkConfig).length)) {
    opts.rebberConfig = clone(rebberConfig)
  }

  if (!opts.extraPlugins) {
    opts.extraPlugins = [
      {obj: remarkImagesDownload, option: opts.remarkConfig.imagesDownload},
    ]
  }

  if (target === 'latex') {
    opts.remarkConfig.canUseTextr = false
  }

  zmd = zmarkdown(opts)
  zmd.renderString = rendererFactory(opts, target)
  zmd.renderFile = (path, cb) => {
    return rendererFactory(opts, target)(fromFile(path), cb)
  }

  return zmd
}
