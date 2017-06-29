const all = require('../all')
module.exports = notes

const defaultMacro = (text, isHeading) => {
  if (isHeading) {
    return `\\protect\\footnote{${text}}`
  }
  return `\\footnote{${text}}`
}

function notes (ctx, node, _, parent) {
  const macro = ctx.footnote || defaultMacro
  return macro(all(ctx, node), parent.type === 'heading')
}
