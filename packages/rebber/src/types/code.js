/* Expose. */
module.exports = code

const defaultMacro = (content, lang) => {
  let param = ''
  if (lang.indexOf('hl_lines=') > -1) {
    const lines = lang.split('hl_lines=')[1].trim()
    param += `[][${lines}]`
  }
  lang = lang.split(' ')[0]
  return `\\begin{codeBlock}${param}{${lang}}\n${content}\n\\end{codeBlock}\n\n`
}

/* Stringify a Blockquote `node`. */
function code (ctx, node) {
  const macro = ctx.code || defaultMacro
  return macro(node.value, node.lang)
}
