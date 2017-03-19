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

const render = (zmd) => {
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
      secret: 'secret',
      s: 'secret',
    }))
    .use(htmlBlocks)
    .use(escapeEscaped())
    .use(kbd)
    .use(math)
    .use(katex)
    .use(stringify)

  const ast = processor.parse(zmd)
  const transformedAST = processor.runSync(ast)
  // uncomment this to inspect the AST
  // logO(transformedAST)
  const stringFromAST = processor.stringify(transformedAST)

  return stringFromAST
}

module.exports = {
  renderFile: (filepath) => render(fromFile(filepath)),
  renderString: (string) => render(string),
}
