const fs = require('fs')
const unified = require('unified')
const inspect = require('unist-util-inspect')

const remarkParse = require('remark-parse')

const remarkAlign = require('remark-align')
const remarkComments = require('remark-comments')
const remarkCustomBlocks = require('remark-custom-blocks')
const remarkEmoticons = require('remark-emoticons')
const remarkEscapeEscaped = require('remark-escape-escaped')
const remarkHeadingShifter = require('remark-heading-shift')
const remarkIframes = require('remark-iframes')
const remarkKbd = require('remark-kbd')
const remarkGridTables = require('remark-grid-tables')
const remarkCaptions = require('remark-captions')
const remarkMath = require('remark-math')
const remarkNumberedFootnotes = require('remark-numbered-footnotes')
const remarkSourcedQuotation = require('remark-captions')
const remarkSubSuper = require('remark-sub-super')
const remarkTextr = require('./remark-textr')
const remarkTrailingSpaceHeading = require('remark-heading-trailing-spaces')

const remark2rehype = require('remark-rehype')

const rehypeKatex = require('rehype-katex')
const rehypeAbbr = require('rehype-abbr')
const rehypeFootnotesTitles = require('rehype-footnotes-title')
const rehypeHTMLBlocks = require('rehype-html-blocks')
const rehypeStringify = require('rehype-stringify')

const rebberStringify = require('rebber')

const defaultConfig = require('./config')
const rebberConfig = {
  override: {
    emoticon: require('rebber/dist/custom-types/emoticon'),
    figure: require('rebber/dist/custom-types/figure'),
  },
  emoticons: defaultConfig.emoticons,
}

const fromFile = (filepath) => fs.readFileSync(filepath)

const zmdParser = (config) => {
  let mdProcessor = unified()
    .use(remarkParse, config.reParse)

  if (!config.isTest) {
    mdProcessor = mdProcessor
      .use(remarkTextr, config.textr)
  }

  mdProcessor = mdProcessor
    .use(remarkAlign, config.alignBlocks)
    .use(remarkComments)
    .use(remarkCustomBlocks, config.customBlocks)
    .use(remarkEmoticons, config.emoticons)
    .use(remarkEscapeEscaped, config.escapeEscaped)
    .use(remarkHeadingShifter, config.headingShifter)
    .use(remarkIframes, config.iframes)
    .use(remarkGridTables)
    .use(remarkCaptions)
    .use(remarkKbd)
    .use(remarkMath, config.math)
    .use(remarkNumberedFootnotes)
    .use(remarkSourcedQuotation)
    .use(remarkSubSuper)
    .use(remarkTrailingSpaceHeading)

  return mdProcessor
}

const rehypeProcessor = (config) =>
  zmdParser(config)
    .use(remark2rehype, config.remark2rehype)

    .use(rehypeHTMLBlocks)
    .use(rehypeFootnotesTitles, config.footnotesTitles)
    .use(rehypeAbbr)
    .use(rehypeKatex, config.katex)

    .use(rehypeStringify)

const rebberProcessor = (config) =>
  zmdParser(config)
    .use(rebberStringify, rebberConfig)

const mdastParser = (opts) => (zmd) => zmdParser(opts).parse(zmd)

const rehypeParser = (opts) => (zmd) => rehypeProcessor(opts).parse(zmd)
const rehypeCompiler = (opts) => (ast) => rehypeProcessor(opts).runSync(ast)
const rehypeStringifier = (opts) => (ast) => rehypeProcessor(opts).stringify(ast)

const rebberParser = (opts) => (zmd) => rebberProcessor(opts).parse(zmd)
const rebberCompiler = (opts) => (ast) => rebberProcessor(opts).runSync(ast)
const rebberStringifier = (opts) => (ast) => rebberProcessor(opts).stringify(ast)

const stringToHTML = (opts) =>
  (string) =>
    rehypeStringifier(opts)(rehypeCompiler(opts)(rehypeParser(opts)(string)))
const stringToLaTeX = (opts) =>
  (string) =>
    rebberStringifier(opts)(rebberCompiler(opts)(rebberParser(opts)(string)))

const fileToHTML = (opts) =>
  (filepath) =>
    stringToHTML(opts)(fromFile(filepath))
const fileToLaTeX = (opts) =>
  (filepath) =>
    stringToLaTeX(opts)(fromFile(filepath))

module.exports = (opts = defaultConfig, to = 'html') => ({
  config: opts,
  inspect: inspect,
  parse: mdastParser(opts),
  transform: to === 'html' ? rehypeCompiler(opts) : rebberCompiler(opts),
  renderFile: to === 'html' ? fileToHTML(opts) : fileToLaTeX(opts),
  renderString: to === 'html' ? stringToHTML(opts) : stringToLaTeX(opts),
})
