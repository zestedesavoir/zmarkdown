/* eslint-disable no-unused-vars, no-console */
const dedent = require('dedent')
const config = require('./index')().config
config.remarkConfig.ping.pingUsername = () => false

const inspector = require('./index')(config)
const zmdHTML = require('./index')(config)
const zmdLatex = require('./index')(config, 'latex')

const zmd = zmdHTML

const input = dedent`
  !(https://www.youtube.com/watch?v=munyJL-9qIs)
`

const ast = inspector.parse(input)
console.log(inspector.inspect(ast))
console.log()

const output = zmd.renderString(input)
console.log(output.contents)
