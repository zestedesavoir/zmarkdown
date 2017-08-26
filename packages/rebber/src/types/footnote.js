/* Expose. */
module.exports = notes

const defaultMacro = (identifier, text, protect) => {
  const footnote = `\\footnote[${identifier}]{\\label{footnote:${identifier}} ${text}}`
  if (protect) {
    return `${footnote}\\protect`
  }
  return footnote
}

function autoId (node) {
  const {line, column, offset} = node.position.start
  return `l${line}c${column}o${offset}`
}

/* Stringify a footnote `node`. */
function notes (ctx, node, _index, parent) {
  const macro = ctx.footnote || defaultMacro
  const protect = !!node.inHeading

  const identifier = autoId(node)

  return macro(identifier, require('../all')(ctx, node).trim(), protect)
}
