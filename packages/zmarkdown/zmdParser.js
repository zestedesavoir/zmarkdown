const unified = require('unified')
const visit = require('unist-util-visit')

const remarkParse = require('remark-parse')

const remarkAbbr = require('remark-abbr/src')
const remarkAlign = require('remark-align/src')
const remarkCaptions = require('remark-captions/src')
const remarkComments = require('remark-comments/src')
const remarkCustomBlocks = require('remark-custom-blocks/src')
const remarkDisableTokenizers = require('remark-disable-tokenizers/src')
const remarkEmoticons = require('remark-emoticons/src')
const remarkEscapeEscaped = require('remark-escape-escaped/src')
const remarkGridTables = require('remark-grid-tables/src')
const remarkHeadingShifter = require('remark-heading-shift/src')
const remarkIframes = require('remark-iframes/src')
const remarkImageToFigure = require('./plugins/remark-image-to-figure')
const remarkKbd = require('remark-kbd/src')
const remarkMath = require('remark-math')
const remarkNumberedFootnotes = require('remark-numbered-footnotes/src')
const remarkPing = require('remark-ping/src')
const remarkSubSuper = require('remark-sub-super/src')
const remarkTextr = require('./plugins/remark-textr')
const remarkTrailingSpaceHeading = require('remark-heading-trailing-spaces')

function getDepth (node) {
  let maxDepth = 0
  if (node.children) {
    node.children.forEach((child) => {
      const depth = getDepth(child)
      if (depth > maxDepth) {
        maxDepth = depth
      }
    })
  }
  return 1 + maxDepth
}

const zmdParser = (config, target) => {
  const mdProcessor = unified()
    .use(remarkParse, config.reParse)

  if (target !== 'latex' && !config.noTypography) {
    mdProcessor
      .use(remarkTextr, config.textr)
  }

  return mdProcessor
    .use(remarkAbbr)
    .use(remarkAlign, config.alignBlocks)
    .use(remarkCaptions, config.captions)
    .use(remarkComments)
    .use(remarkCustomBlocks, config.customBlocks)
    .use(remarkDisableTokenizers, config.disableTokenizers)
    .use(remarkEmoticons, config.emoticons)
    .use(remarkEscapeEscaped, config.escapeEscaped)
    .use(remarkGridTables)
    .use(remarkHeadingShifter, config.headingShifter)
    .use(remarkIframes, config.iframes)
    .use(remarkMath, config.math)
    .use(remarkKbd)
    .use(remarkNumberedFootnotes)
    .use(remarkPing, config.ping)
    .use(remarkSubSuper)
    .use(remarkTrailingSpaceHeading)
    .use(remarkImageToFigure)
    .use(() => (tree, vfile) => {
      /* extract some metadata for frontends */

      // if we don't have any headings, we add a flag to disable
      // the Table of Contents directly in the latex template
      vfile.data.disableToc = true
      visit(tree, 'heading', () => {
        vfile.data.disableToc = false
      })

      // get a unique list of languages used in input
      const languages = new Set()
      visit(tree, 'code', (node) => {
        if (node.lang) languages.add(node.lang)
      })
      vfile.data.languages = [...languages]
    })
    .use(() => (tree, vfile) => {
      // limit AST depth to config.maxNesting
      visit(tree, 'root', (node) => {
        vfile.data.depth = getDepth(node) - 2
      })
      if (vfile.data.depth > config.maxNesting) {
        vfile.fail(`Markdown AST too complex: tree depth > ${config.maxNesting}`)
      }
    })
}

module.exports = zmdParser
