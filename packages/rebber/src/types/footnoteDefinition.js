module.exports = notes

const defaultMacro = (identifier, text) =>
  `\\footnotetext[${identifier}]{\\label{footnote:${identifier}} ${text}}\n`

function notes (ctx, node) {
  const macro = ctx.footnoteDefinition || defaultMacro
  return macro(node.identifier, require('../all')(ctx, node).trim())
}
