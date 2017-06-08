/* Expose. */
const all = require('../all')
module.exports = blockquote

/* Stringify a comment `node`. */
function blockquote (ctx, node) {
  const source = node.author || 'Anonymous'
  const innerText = all(ctx, node)
  return `\\begin{Quotation}{${source}}
${innerText.trim()}
\\end{Quotation}\n\n`
}
