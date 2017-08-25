module.exports = (ctx, node) => {
  if (ctx.tableHeader) {
    return ctx.tableHeader(node.value)
  }
  return require('rebber/dist/all')(ctx, node)
}
