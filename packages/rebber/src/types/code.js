/* Expose. */
module.exports = code

const defaultMacro = (content, lang) => {
  if (!lang) lang = 'text'
  let param = ''
  if (lang.indexOf('hl_lines=') > -1) {
    let lines = lang.split('hl_lines=')[1].trim()
    if (
      (lines.startsWith('"') && lines.endsWith('"')) ||
      (lines.startsWith("'") && lines.endsWith("'"))
    ) {
      lines = lines.slice(1, -1).trim()
    }
    param += `[][${lines}]`
  }
  lang = lang.split(' ')[0]
  return `\\begin{CodeBlock}${param}{${lang}}\n${content}\n\\end{CodeBlock}\n\n`
}

/* Stringify a Blockquote `node`. */
function code (ctx, node) {
  const macro = ctx.code || defaultMacro
  return macro(node.value, node.lang)
}
