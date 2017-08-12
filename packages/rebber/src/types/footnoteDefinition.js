const all = require('../all')
module.exports = notes

const defaultMacro = (identifier, text) =>
  `\\footnotetext[${identifier}]{\\label{footnote:${identifier}} ${text}}\n`

function notes (ctx, node) {
  const macro = ctx.footnoteDefinition || defaultMacro
  return macro(node.identifier, all(ctx, node).trim())
}
