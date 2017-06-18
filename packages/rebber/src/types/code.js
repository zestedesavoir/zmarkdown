/* Expose. */
module.exports = code

const defaultMacro = (content, lang) =>
  `\\begin{codeBlock}{${lang}}\n${content}\n\\end{codeBlock}\n\n`

/* Stringify a Blockquote `node`. */
function code (ctx, node) {
  const macro = ctx.code || defaultMacro
  return macro(node.value, node.lang)
}
