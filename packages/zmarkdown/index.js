const fs = require('fs')
const unified = require('unified')
const reParse = require('remark-parse')
const math = require('remark-math')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')
const inspect = require('unist-util-inspect')
const textr = require('remark-textr')

const align = require('remark-align')
const trailingSpaceHeading = require('remark-heading-trailing-spaces')
const headingShifter = require('remark-heading-shift')
const escapeEscaped = require('remark-escape-escaped')
const kbd = require('remark-kbd')
const customBlocks = require('remark-custom-blocks')
const htmlBlocks = require('remark-html-blocks')
const subSuper = require('remark-sub-super')
const emoticons = require('remark-emoticons')
const numberedFootnotes = require('remark-numbered-footnotes')
const iframes = require('remark-iframes')
const comments = require('remark-comments')

const rehypeAbbr = require('rehype-abbr')
const rehypeFootnotesTitles = require('rehype-footnotes-title')

const defaultConfig = require('./config')

const fromFile = (filepath) => fs.readFileSync(filepath)

const processor = (config) =>
  unified()
    .use(reParse, config.reParse)
    .use(textr, config.textr)
    .use(trailingSpaceHeading)
    .use(headingShifter, config.headingShifter)
    .use(numberedFootnotes)
    .use(remark2rehype, config.remark2rehype)
    .use(rehypeFootnotesTitles, config.footnotesTitles)
    .use(customBlocks, config.customBlocks)
    .use(htmlBlocks)
    .use(align, config.alignBlocks)
    .use(rehypeAbbr)
    .use(math, config.math)
    .use(katex, config.katex)
    .use(escapeEscaped, config.escapeEscaped)
    .use(kbd)
    .use(comments)
    .use(iframes, config.iframes)
    .use(subSuper)
    .use(emoticons, config.emoticons)
    .use(stringify)

const parse = (opts) => (zmd) => processor(opts).parse(zmd)
const transform = (opts) => (ast) => processor(opts).runSync(ast)
const render = (opts) => (ast) => processor(opts).stringify(ast)

const renderString = (opts) => (string) => render(opts)(transform(opts)(parse(opts)(string)))
const renderFile = (opts) => (filepath) => renderString(opts)(fromFile(filepath))

module.exports = (opts = defaultConfig) => ({
  config: opts,
  inspect: inspect,
  parse: parse(opts),
  transform: transform(opts),
  renderFile: renderFile(opts),
  renderString: renderString(opts),
})
