const defaultMdastConfig = require('../config/mdast')
const defaultHtmlConfig = require('../config/html')

import {mdastParser} from './zmdast'

export const htmlParser = require('../renderers/html')

export function renderHtml (
  markdown,
  cb,
  mdConfig = defaultMdastConfig,
  htmlConfig = defaultHtmlConfig,
) {
  const parser = mdastParser(mdConfig)
  htmlParser(parser, htmlConfig)

  parser.process(markdown, (err, vfile) => {
    if (err) return cb(err)

    cb(null, vfile)
  })
}
