/* Dependencies. */
const all = require('rebber/dist/all')

/* Expose. */
module.exports = notes

const defaultMacro = (identifier, text, protect) =>
  `${protect ? '\\protect' : ''}\\footnotetext[${identifier}]{${text}}`

function notes (ctx, node) {
  const macro = ctx.footnoteDefinition || defaultMacro
  const protect = Boolean(node.inHeading)

  return macro(node.identifier, all(ctx, node).trim(), protect)
}
