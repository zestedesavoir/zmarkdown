const one = require('../one')

/* Expose. */
module.exports = table

const defaultHeaderParse = (rows) => {
  const columns = Math.max(...rows.map(l => l.split('&').length))
  const colHeader = `|${'c|'.repeat(columns)}`
  return colHeader
}

const defaultMacro = (ctx, node) => {
  const headerParse = ctx.headerParse ? ctx.headerParse : defaultHeaderParse
  const parsed = node.children.map((n, index) => one(ctx, n, index, node))
  const inner = parsed.join('')
  const colHeader = headerParse(parsed)
  const addendum = node.caption
    ? `\n\\tableCaption{${node.caption}}\n`
    : ''
  return `\\begin{longtabu}{${colHeader}} \\hline\n${inner}${addendum}\\end{longtabu}\n\n`
}

/* Stringify a table `node`. */
function table (ctx, node) {
  const macro = ctx.table || defaultMacro
  return macro(ctx, node)
}
