const customCodeMacro = (content, lang, attrs) => {
  // Default language is "text"
  if (!lang) lang = 'text'

  // Escape CodeBlocks
  const escaped = content.replace(new RegExp('\\\\end\\s*{CodeBlock}', 'g'), '')
  const hasHlLines = (attrs && attrs.hlLines && attrs.hlLines !== [])
  const hasLinenostart = (attrs && attrs.linenostart && attrs.linenostart !== 1)

  let params = ''

  // Optional caption is not used
  if (hasHlLines || hasLinenostart) {
    params += '[]'
  }

  // Line highlight
  if (hasHlLines) {
    params += `[${attrs.hlLines.split(' ').join(',')}]`
  } else if (hasLinenostart) {
    params += '[]'
  }

  if (hasLinenostart) {
    params += `[${attrs.linenostart}]`
  }

  return `\\begin{CodeBlock}${params}{${lang}}\n${escaped}\n\\end{CodeBlock}\n\n`
}

/* Expose. */
module.exports = customCodeMacro
