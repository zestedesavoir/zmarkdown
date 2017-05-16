/* eslint-disable no-console */
const { renderString, parse, inspect } = require('./index.js')()

/*
1. Write a plugin
2. `.use()` is in `processor` in `index.js`
3. `npm run wip`
4. Changing the markdown below or modifying your plugin will refresh your terminal
*/

const markdown = `
a : b

ç'a

foo!

bar !
`

const now = String(new Date())
const dash = '='.repeat(Math.floor((80 - now.length) / 2))
console.log(`\n${dash}${now}${dash}${dash % 2 ? '' : '='}\n`)

console.log(renderString(markdown))

console.log(`\n${'-'.repeat(80)}\n`)

console.error(inspect(parse(markdown)))
