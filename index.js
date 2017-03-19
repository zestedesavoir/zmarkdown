const fs = require('fs')
const unified = require('unified')
const parse = require('remark-parse')
const math = require('remark-math')
const katex = require('remark-html-katex')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const htmlBlocks = require('./packages/html-blocks')
const escapeEscaped = require('./packages/escape-escaped')
const kbd = require('./packages/kbd')
const customBlocks = require('./packages/custom-blocks')

const fromFile = (filepath) => fs.readFileSync(filepath)
const logO = (...xs) => // eslint-disable-line no-unused-vars
  xs.forEach(x =>
    console.log(JSON.stringify(x, null, 2))) // eslint-disable-line no-console

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
    i: 'information ico-after',
    information: 'information ico-after',
    q: 'question ico-after',
    question: 'question ico-after',
    a: 'warning ico-after',
    attention: 'warning ico-after',
    e: 'error ico-after',
    erreur: 'error ico-after',
  }))
  .use(htmlBlocks)
  .use(escapeEscaped())
  .use(kbd)
  .use(math)
  .use(katex)
  .use(stringify)

const getAST = (zmd) => {
  const ast = processor.parse(zmd)
  const transformedAST = processor.runSync(ast)
  // uncomment this to inspect the AST
  // logO(transformedAST)
  return transformedAST
}

const render = (ast) => processor.stringify(ast)

module.exports = {
  getAST: getAST,
  renderFile: (filepath) => render(getAST(fromFile(filepath))),
  renderString: (string) => render(getAST(string)),
}
