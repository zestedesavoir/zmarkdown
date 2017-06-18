/* eslint-disable no-unused-vars, no-console */
const dedent = require('dedent')
const config = require('./index').config
const {
  inspect,
  parse,
  transform,
  renderFile,
  renderString
} = require('./index')(config, 'html')

const input = dedent`
  **foo**

  <<a>>

  <<z>>

  << a >>

  << z >>
`

console.log(inspect(parse(input)))
console.log(renderString(input))
