/* Expose. */
const one = require('../one')
module.exports = table

const defaultMacro = (ctx, node) => {
  const parsed = node.children.map((n, index) => one(ctx, n, index, node))
  const inner = parsed.join('')
  const lengths = inner.split('\\hline\n').map(l => l.split('&').length)
  const cols = lengths.sort(cmp)[0]
  let colHeader = '|'
  colHeader += 'c|'.repeat(cols)
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
