/* eslint-disable no-unused-vars, no-console */
const dedent = require('dedent')
const config = require('./config')
config.ping.pingUsername = () => false

const zmdHTML = require('./index')(config, 'html')
const zmdTex = require('./index')(config, 'latex')

const zmd = zmdHTML
const input = dedent`
  hey @clem

  @foo

  > foo

  haha
`
const ast = zmd.parse(input)
console.log(zmd.inspect(ast))

const output = zmd.renderString(input)
console.log(output.content)
