const one = require('../one')

/* Expose. */
module.exports = table

const defaultHeaderParse = (rows) => {
  const lengths = rows.map(l => l.split('&').length)
  const cols = lengths.sort(cmp)[0]
  let colHeader = '|'
  colHeader += 'c|'.repeat(cols)
  return colHeader
}
const defaultMacro = (ctx, node) => {
  const headerParse = ctx.headerParse ? ctx.headerParse : defaultHeaderParse
  const parsed = node.children.map((n, index) => one(ctx, n, index, node))
  const inner = parsed.join('')
  const colHeader = headerParse(parsed)
  let addendum = ''
  if (node.caption) {
    addendum = `\n\\tableCaption{${node.caption}}\n`
  }
  return `\\begin{longtabu}{${colHeader}} \\hline\n${inner}${addendum}\\end{longtabu}\n\n`
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
