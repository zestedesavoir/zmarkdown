/* Expose. */
module.exports = inlineCode

const escape = require('../escaper')

function inlineCode (ctx, node) {
  const finalCode = escape(node.value)
  return `\\texttt{${finalCode}}`
}
