/* Expose. */
module.exports = notes

const defaultMacro = (identifier, protect) =>
  `\\textsuperscript{${protect ? '\\protect' : ''}\\footnotemark[${identifier}]}`

function notes (ctx, node) {
  const macro = ctx.footnoteReference || defaultMacro
  const protect = Boolean(node.inHeading)

  return macro(node.identifier, protect)
}
