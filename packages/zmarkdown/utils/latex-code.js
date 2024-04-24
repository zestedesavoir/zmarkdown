const customCodeMacro = (content, lang, attrs) => {
  // Default language is "text"
  if (!lang) lang = 'text'

  // Escape CodeBlocks
  let escaped = content

  const escapeRegex = /\\end\s*{CodeBlock}/g

  while (escapeRegex.test(escaped)) {
    escaped = escaped.replace(escapeRegex, '')
  }

  // Detect features
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
