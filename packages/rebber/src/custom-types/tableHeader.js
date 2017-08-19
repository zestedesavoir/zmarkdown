module.exports = (ctx, node) => {
  if (ctx.tableHeader) {
    return ctx.tableHeader(node.value)
  }
  return require('../all')(ctx, node)
}
