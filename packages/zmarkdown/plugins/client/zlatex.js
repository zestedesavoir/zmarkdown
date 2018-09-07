const rebberStringify = require('rebber/src')
const rebberConfig = require('../../config/rebber')

const common = require('../../common')

let parser

function getLatexProcessor (config) {
  config.remarkConfig.noTypography = true

  return parser.zmdParser(config.remarkConfig, config.extraRemarkPlugins)
    .use(rebberStringify, rebberConfig)
}

parser = common(null, getLatexProcessor)

export function render (input, cb) {
  return parser.render(input, cb)
}

export const name = 'zlatex'
