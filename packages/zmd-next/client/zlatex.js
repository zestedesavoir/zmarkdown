const defaultMdastConfig = require('../config/mdast')
const defaultLatexConfig = require('../config/latex')

import {mdastParser} from './zmdast'

export const latexParser = require('../renderers/latex')

export function renderLatex (
  markdown,
  cb,
  mdConfig = defaultMdastConfig,
  latexConfig = defaultLatexConfig,
) {
  const parser = mdastParser(mdConfig)
  latexParser(parser, latexConfig)

  parser.process(markdown, (err, vfile) => {
    if (err) return cb(err)

    cb(null, vfile)
  })
}
