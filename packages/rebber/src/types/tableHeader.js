module.exports = (ctx, node) => {
  const macro = ctx.tableHeader ? ctx.tableHeader : require('../all')
  return macro(ctx, node)
}
