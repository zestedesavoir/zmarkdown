/* Expose. */
const all = require('../all')
module.exports = tableCell

const defaultMacro = (ctx, node) => {
  return all(ctx, node)
}

/* Stringify a tableCell `node`. */
function tableCell (ctx, node) {
  const macro = ctx.tableCell || defaultMacro
  return macro(ctx, node)
}
