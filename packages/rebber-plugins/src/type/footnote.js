/* Dependencies. */
const all = require('rebber/dist/all')

/* Expose. */
module.exports = notes

const defaultMacro = (identifier, text, protect) => {
  const footnote = `${protect ? '\\protect' : ''}\\footnote[${identifier}]{${text}}`

  return footnote
}

function autoId (node) {
  const {line, column, offset} = node.position.start
  return `l${line}c${column}o${offset}`
}

/* Stringify a footnote `node`. */
function notes (ctx, node) {
  const macro = ctx.footnote || defaultMacro
  const protect = Boolean(node.inHeading)

  const identifier = autoId(node)

  return macro(identifier, all(ctx, node).trim(), protect)
}
