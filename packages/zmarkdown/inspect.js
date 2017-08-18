/* eslint-disable no-unused-vars, no-console */
const dedent = require('dedent')
const remarkConfig = require('./remark-config')
const rebberConfig = require('./rebber-config')
remarkConfig.ping.pingUsername = () => false

const inspector = require('./index')({remarkConfig, rebberConfig})
const zmdHTML = require('./index')({remarkConfig, rebberConfig}, 'html')
const zmdLatex = require('./index')({remarkConfig, rebberConfig}, 'latex')

const zmd = zmdLatex
const input = dedent`
  hey @clem

  @foo

  > foo

  haha
`

const ast = inspector.parse(input)
console.log(ast)
console.log(inspector.inspect(ast))

const output = zmd.renderString(input)
console.log(output.content)
