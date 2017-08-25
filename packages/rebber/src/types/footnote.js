/* Expose. */
module.exports = notes

const defaultMacro = (identifier, text, protect) => {
  const footnote = `\\footnote[${identifier}]{\\label{footnote:${identifier}} ${text}}`
  if (protect) {
    return `${footnote}\\protect`
  }
  return footnote
}

/* Stringify a footnote `node`. */
function notes (ctx, node, _index, parent) {
  const macro = ctx.footnote || defaultMacro
  const protect = !!node.inHeading

  return macro(node.identifier, require('../all')(ctx, node).trim(), protect)
}
