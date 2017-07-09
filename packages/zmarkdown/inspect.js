/* eslint-disable no-unused-vars, no-console */
const dedent = require('dedent')
const config = require('./index')().config

const zmdHTML = require('./index')(config, 'html')
const zmdTex = require('./index')(config, 'latex')

const zmd = zmdHTML

const input = dedent`
  hey @clem

  @foo
`

console.log(zmd.inspect(zmd.parse(input)))
console.log(zmd.renderString(input))
