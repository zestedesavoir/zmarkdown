const all = require('../all')

module.exports = notes

const defaultMacro = (text, protect) => {
  if (protect) {
    return `\\protect\\footnote{${text}}`
  }
  return `\\footnote{${text}}`
}

function notes (ctx, node, _index, parent) {
  const macro = ctx.footnote || defaultMacro
  const protect = !!node.inHeading

  return macro(all(ctx, node), protect)
}
