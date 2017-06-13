/* Expose. */
const all = require('../all')
module.exports = code

const defaultMacro = (innerText, lang) =>
  `\\begin{codeBlock}{${lang}} '\n${innerText}\n\\end{codeBlock}\n\n`

/* Stringify a Blockquote `node`. */
function code (ctx, node) {
  const macro = ctx.code || defaultMacro
  const innerText = all(ctx, node)
  return macro(innerText.trim(), node.lang)
}
