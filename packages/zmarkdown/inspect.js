/* eslint-disable no-unused-vars, no-console */
const dedent = require('dedent')
const config = require('./index').config
const {
  inspect,
  parse,
  transform,
  renderFile,
  renderString
} = require('./index')(config, 'latex')

const input = dedent`
  A sentence ($S$) with *italic*[^italic] and inline match ($C_L$) and $$b$$ another[^bar] footnote.

  $$
  L = \frac{1}{2} \rho v^2 S C_L
  $$

  hehe

`

console.log(inspect(parse(input)))
console.log(renderString(input))
