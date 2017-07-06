const fs = require('fs')
const unified = require('unified')
const inspect = require('unist-util-inspect')

const remarkParse = require('remark-parse')

const remarkAbbr = require('remark-abbr')
const remarkAlign = require('remark-align')
const remarkCaptions = require('remark-captions')
const remarkComments = require('remark-comments')
const remarkCustomBlocks = require('remark-custom-blocks')
const remarkEmoticons = require('remark-emoticons')
const remarkEscapeEscaped = require('remark-escape-escaped')
const remarkGridTables = require('remark-grid-tables')
const remarkHeadingShifter = require('remark-heading-shift')
const remarkIframes = require('remark-iframes')
const remarkKbd = require('remark-kbd')
const remarkMath = require('remark-math')
const remarkNumberedFootnotes = require('remark-numbered-footnotes')
const remarkSubSuper = require('remark-sub-super')
const remarkTextr = require('./remark-textr')
const remarkTrailingSpaceHeading = require('remark-heading-trailing-spaces')

const remark2rehype = require('remark-rehype')

const rehypeKatex = require('rehype-katex')
const rehypeFootnotesTitles = require('rehype-footnotes-title')
const rehypeHTMLBlocks = require('rehype-html-blocks')
const rehypeStringify = require('rehype-stringify')

const rebberStringify = require('rebber')

const defaultConfig = require('./config')
const rebberConfig = {
  override: {
    emoticon: require('rebber/dist/custom-types/emoticon'),
    figure: require('rebber/dist/custom-types/figure'),
    sub: require('rebber/dist/custom-types/sub'),
    sup: require('rebber/dist/custom-types/sup'),
    kbd: require('rebber/dist/custom-types/kbd'),
    CenterAligned: require('rebber/dist/custom-types/align'),
    RightAligned: require('rebber/dist/custom-types/align'),
    informationCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    secretCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    erreurCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    warningCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    questionCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    abbr: require('rebber/dist/custom-types/abbr'),
    gridTable: require('rebber/dist/custom-types/gridTable'),
  },
  emoticons: defaultConfig.emoticons,
  link: {
    prefix: 'http://zestedesavoir.com'
  },
}

Object.assign(rebberConfig.override, {
  eCustomBlock: (ctx, node) => {
    node.type = 'errorCustomBlock'
    return rebberConfig.override.erreurCustomBlock(ctx, node)
  },
  iCustomBlock: (ctx, node) => {
    node.type = 'informationCustomBlock'
    return rebberConfig.override.informationCustomBlock(ctx, node)
  },
  qCustomBlock: (ctx, node) => {
    node.type = 'questionCustomBlock'
    return rebberConfig.override.questionCustomBlock(ctx, node)
  },
  sCustomBlock: (ctx, node) => {
    node.type = 'secretCustomBlock'
    return rebberConfig.override.secretCustomBlock(ctx, node)
  },
  aCustomBlock: (ctx, node) => {
    node.type = 'warningCustomBlock'
    return rebberConfig.override.warningCustomBlock(ctx, node)
  },
  attentionCustomBlock: (ctx, node) => {
    node.type = 'attentionCustomBlock'
    return rebberConfig.override.warningCustomBlock(ctx, node)
  },
})

const fromFile = (filepath) => fs.readFileSync(filepath)

const zmdParser = (config) => {
  let mdProcessor = unified()
    .use(remarkParse, config.reParse)

  if (!config.isTest) {
    mdProcessor = mdProcessor
      .use(remarkTextr, config.textr)
  }

  mdProcessor = mdProcessor
    .use(remarkAbbr)
    .use(remarkAlign, config.alignBlocks)
    .use(remarkCaptions, config.captions)
    .use(remarkComments)
    .use(remarkCustomBlocks, config.customBlocks)
    .use(remarkEmoticons, config.emoticons)
    .use(remarkEscapeEscaped, config.escapeEscaped)
    .use(remarkGridTables)
    .use(remarkHeadingShifter, config.headingShifter)
    .use(remarkIframes, config.iframes)
    .use(remarkMath, config.math)
    .use(remarkKbd)
    .use(remarkNumberedFootnotes)
    .use(remarkSubSuper)
    .use(remarkTrailingSpaceHeading)

  return mdProcessor
}

const rehypeProcessor = (config) =>
  zmdParser(config)
    .use(remark2rehype, config.remark2rehype)

    .use(rehypeHTMLBlocks)
    .use(rehypeFootnotesTitles, config.footnotesTitles)
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
