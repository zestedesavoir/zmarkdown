/* Expose. */
const one = require('../one')
module.exports = table

const defaultMacro = (ctx, node) => {
  let j = 0
  const parsed = []
  node.children.map(n => parsed.push(one(ctx, n, j++, node)))
  const inner = parsed.join('')
  const lengths = []
  inner.split('\\hline\n').map(l => lengths.push(l.split('&').length))
  const cols = lengths.sort(cmp)[0]
  let colHeader = '|'
  let i = 0
  for (;i < cols; i++) {
    colHeader += 'c|'
  }
  return `\\begin{longtabu}{${colHeader}} \\hline\n${inner}\\end{longtabu}\n\n`
}

/* Stringify a table `node`. */
function table (ctx, node) {
  const macro = ctx.table || defaultMacro
  return macro(ctx, node)
}

function cmp (a, b) {
  if (a < b) return 1
  if (a > b) return -1
  return 0
}
