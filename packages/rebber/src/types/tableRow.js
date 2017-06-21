/* Expose. */
const one = require('../one')
module.exports = tableRow

const defaultMacro = (ctx, node) => {
  const parsed = []
  node.children.map((n, index) => parsed.push(one(ctx, n, index, node)))
  const line = parsed.join(' & ')
  return `${line}\\\\ \\hline\n`
}

/* Stringify a tableRow `node`. */
function tableRow (ctx, node) {
  const macro = ctx.tableRow || defaultMacro
  return macro(ctx, node)
}
