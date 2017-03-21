const fs = require('fs')
const unified = require('unified')
const reParse = require('remark-parse')
const math = require('remark-math')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')
const inspect = require('unist-util-inspect')

const headingShifter = require('./packages/heading-shift')
const htmlBlocks = require('./packages/html-blocks')
const escapeEscaped = require('./packages/escape-escaped')
const kbd = require('./packages/kbd')
const customBlocks = require('./packages/custom-blocks')
const sub_super = require('./packages/sub_super')
const remove_backslash = require('./packages/remove_backslash')

const fromFile = (filepath) => fs.readFileSync(filepath)

const processor = ({ headingShift } = {}) =>
  unified()
    .use(reParse, {
      gfm: true,
      commonmark: false,
      yaml: false,
      footnotes: true,
      /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
      &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
      blocks: [],
    })
    .use(headingShifter(headingShift || 0))
    .use(remark2rehype, { allowDangerousHTML: true })
    .use(customBlocks({
      secret: 'spoiler',
      s: 'spoiler',
      information: 'information ico-after',
      i: 'information ico-after',
      question: 'question ico-after',
      q: 'question ico-after',
      attention: 'warning ico-after',
      a: 'warning ico-after',
      erreur: 'error ico-after',
      e: 'error ico-after',
    }))
    .use(math)
    .use(htmlBlocks)
    .use(escapeEscaped())
    .use(kbd)
    .use(katex)
    .use(stringify)

const parse = (opts) => (zmd) => processor(opts).parse(zmd)
const transform = (opts) => (ast) => processor(opts).runSync(ast)
const render = (opts) => (ast) => processor(opts).stringify(ast)

const renderString = (opts) => (string) => render(opts)(transform(opts)(parse(opts)(string)))
const renderFile = (opts) => (filepath) => renderString(opts)(fromFile(filepath))

module.exports = (opts) => ({
  inspect: inspect,
  parse: parse(opts),
  transform: transform(opts),
  renderFile: renderFile(opts),
  renderString: renderString(opts),
})
