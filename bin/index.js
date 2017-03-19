/* eslint-disable no-console */
const dedent = require('dedent')
const { renderFile } = require('../index.js')

if (process.argv.length > 2) {
  const files = process.argv.slice(2)
  files.forEach(file => {
    if (files.length === 1) {
      console.error(`${file}\n`)
    } else {
      console.log(`${file}\n`)
    }
    console.log(renderFile(file))
  })
} else {
  console.error(dedent`
    CLI help:
      $ zmarkdown filename              # prints name  to stderr, renders file  to stdout
      $ zmarkdown filename1 filename2 … # prints names to stdout, renders files to stdout
  `)
}
