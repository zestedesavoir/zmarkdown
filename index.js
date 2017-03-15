const fs = require('fs')
const remark = require('remark')
const html = require('remark-html')

const fromFile = (filepath) => fs.readFileSync(filepath)

const render = (zmd) => {
  const processor = remark().use(html)
  const ast = processor.parse(zmd)
  const transformedAST = processor.runSync(ast)
  const stringFromAST = processor.stringify(transformedAST)
  return stringFromAST
}

module.exports = {
  renderFile: (filepath) => render(fromFile(filepath)),
  renderString: (string) => render(string),
}
