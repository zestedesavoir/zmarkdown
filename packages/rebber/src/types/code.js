/* Expose. */
module.exports = code

const defaultMacro = (content, lang) => {
  // Escape CodeBlocks
  const escaped = content.replace(new RegExp('\\\\end\\s*{CodeBlock}', 'g'), '')

  // Default language is "text"
  if (!lang) lang = 'text'

  return `\\begin{CodeBlock}{${lang}}\n${escaped}\n\\end{CodeBlock}\n\n`
}

/* Stringify a code `node`. */
function code (ctx, node) {
  const macro = ctx.code || defaultMacro
  return `${macro(node.value, node.lang, node.meta)}`
}

code.macro = defaultMacro
