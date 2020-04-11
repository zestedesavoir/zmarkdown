const rendererForge           = require('./rendererForge')

const unified                 = require('unified')
const remarkParse             = require('remark-parse')
const remarkDisableTokenizers = require('remark-disable-tokenizers/src')

const defaultTokenizerList = {
  abbr:                 require('remark-abbr/src'),
  alignBlocks:          require('remark-align/src'),
  captions:             require('remark-captions/src'),
  comments:             require('remark-comments/src'),
  customBlocks:         require('remark-custom-blocks/src'),
  emoticons:            require('remark-emoticons/src'),
  escapeEscaped:        require('remark-escape-escaped/src'),
  headingShifter:       require('remark-heading-shift/src'),
  gridTables:           require('remark-grid-tables/src'),
  iframes:              require('remark-iframes/src'),
  imageToFigure:        require('../plugins/remark-image-to-figure'),
  kbd:                  require('remark-kbd/src'),
  math:                 require('remark-math'),
  numberedFootnotes:    require('remark-numbered-footnotes/src'),
  ping:                 require('remark-ping/src'),
  subSuper:             require('remark-sub-super/src'),
  textr:                require('../plugins/remark-textr'),
  trailingSpaceHeading: require('remark-heading-trailing-spaces'),
}

const postProcessorList = {
  getStats:      require('../postprocessors/md-get-stats'),
  limitDepth:    require('../postprocessors/md-limit-depth'),
  listLanguages: require('../postprocessors/md-list-languages'),
}

module.exports = (config) => {
  const baseTokenizer = unified()
    .use(remarkParse, config.parse)

  rendererForge(
    baseTokenizer,
    defaultTokenizerList,
    postProcessorList
  )(config)

  return baseTokenizer
    .use(remarkDisableTokenizers, config.disabledTokenizers)
}
