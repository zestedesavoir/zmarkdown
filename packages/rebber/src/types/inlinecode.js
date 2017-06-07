/* Expose. */
module.exports = inlineCode

function inlineCode (ctx, node) {
  return `\texttt{${node.value}}`
}
