const fs = require('fs')
const unified = require('unified')
const reParse = require('remark-parse')
const math = require('remark-math')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')
const inspect = require('unist-util-inspect')

const htmlBlocks = require('./packages/html-blocks')
const escapeEscaped = require('./packages/escape-escaped')
const kbd = require('./packages/kbd')
const customBlocks = require('./packages/custom-blocks')

const fromFile = (filepath) => fs.readFileSync(filepath)

const processor = unified()
  .use(reParse, {
    gfm: true,
    commonmark: false,
    yaml: false,
    footnotes: true,
    /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
    &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
    blocks: [],
  })
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

const parse = (zmd) => processor.parse(zmd)
const transform = (ast) => processor.runSync(ast)
const render = (ast) => processor.stringify(ast)

const renderFile = (filepath) => render(transform(parse(fromFile(filepath))))
const renderString = (string) => render(transform(parse(string)))

module.exports = {
  parse,
  transform,
  inspect,
  renderFile,
  renderString,
}
