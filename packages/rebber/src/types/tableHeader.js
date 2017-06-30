const all = require('../all')

module.exports = (ctx, node) => {
  const macro = ctx.tableHeader ? ctx.tableHeader : all
  return macro(ctx, node)
}
