/* Expose. */
module.exports = code

const codeBlockParamsMapping = [
  null,
  'hl_lines=',
  'linenostart=',
]

const defaultMacro = (content, lang, attrs) => {
  // Default language is "text"
  if (!lang) lang = 'text'

  // Create a list of attributes to be serialized
  const localCodeBlockParams = Array(codeBlockParamsMapping.length).fill('')

  // Check for attributes and enumerate them
  if (attrs !== null) {
    for (let i = 0; i < codeBlockParamsMapping.length; i++) {
      const param = codeBlockParamsMapping[i]
      // Skip unwanted parameters
      if (param === null) continue
      const location = attrs.indexOf(param)

      // Parse the attributes we know
      if (location > -1) {
        const begin = location + param.length
        const remaining = attrs.slice(begin)
        const length = remaining.indexOf(' ')
        let value = length > -1 ? attrs.slice(begin, begin + length) : remaining

        // Remove string-delimiters
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1).trim()
        }

        localCodeBlockParams[i] = value
      }
    }
  }

  // If we matched something, return optional arguments
  // Note that we do stop serialization on a chain of empty arguments
  const matched = localCodeBlockParams.reduce((a, v, i) => v !== '' ? i : a, -1) + 1
  const param = matched > 0 ? `[${localCodeBlockParams.slice(0, matched).join('][')}]` : ''

  return `\\begin{CodeBlock}${param}{${lang}}\n${content}\n\\end{CodeBlock}\n\n`
}

/* Stringify a code `node`. */
function code (ctx, node) {
  const macro = ctx.code || defaultMacro
  return `${macro(node.value, node.lang, node.meta, node)}`
}

code.macro = defaultMacro
