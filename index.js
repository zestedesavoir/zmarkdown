const fs = require('fs')
const unified = require('unified')
const parse = require('remark-parse')
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
  .use(parse, {
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

const getAST = (zmd) => {
  const ast = processor.parse(zmd)
  const transformedAST = processor.runSync(ast)
  return transformedAST
}

const render = (ast) => processor.stringify(ast)

module.exports = {
  getAST: getAST,
  inspect: inspect,
  renderFile: (filepath) => render(getAST(fromFile(filepath))),
  renderString: (string) => render(getAST(string)),
}
