const fs = require('fs')
const unified = require('unified')
const parse = require('remark-parse')
const math = require('remark-math')
const katex = require('remark-html-katex')
const html = require('remark-html')

const escapeEscaped = require('./packages/escape-escaped')

const fromFile = (filepath) => fs.readFileSync(filepath)

const render = (zmd) => {
  const processor = unified()
    .use(parse, {
      gfm: true,
      commonmark: false,
      yaml: false,
      footnotes: true,
    })
    .use(escapeEscaped())
    .use(math)
    .use(katex)
    .use(html)

  const ast = processor.parse(zmd)
  const transformedAST = processor.runSync(ast)
  const stringFromAST = processor.stringify(transformedAST)

  return stringFromAST
}

module.exports = {
  renderFile: (filepath) => render(fromFile(filepath)),
  renderString: (string) => render(string),
}
