/* Expose. */
const all = require('../all')
module.exports = blockquote

/* Stringify a comment `node`. */
function blockquote (ctx, node) {
  let macro = 'Quotation'
  let useSource = false
  if (ctx && ctx.blockquote) {
    if (ctx.blockquote.macro) macro = ctx.blockquote.macro
    if (ctx.blockquote.useSource === true) useSource = true
  }
  const source = `{${node.author || 'Anonymous'}}`
  const innerText = all(ctx, node)
  return `\\begin{${macro}}${useSource ? source : ''}
${innerText.trim()}
\\end{${macro}}\n\n`
}
