const clone = require('clone')

const one = require('../one')

/* Expose. */
module.exports = table

const defaultHeaderParse = rows => {
  const columns = Math.max(...rows.map(l => l.split('&').length))
  return ' X[-1]'.repeat(columns).substring(1)
}

// Retrocompatibility: first row is always header on default tables
const defaultheaderCounter = () => {
  return 1
}

const defaultMacro = (ctx, node) => {
  const headerParse = ctx.headerParse ? ctx.headerParse : defaultHeaderParse
  const headerCounter = ctx.headerCounter ? ctx.headerCounter : defaultheaderCounter

  const parsed = node.children.map((n, index) => one(ctx, n, index, node))
  const headerCount = headerCounter(node)
  const colHeader = headerParse(parsed)

  const envName = typeof ctx.tableEnvName === 'string' ? ctx.tableEnvName : 'longtblr'
  const caption = node.caption
    ? `\n\\captionof{table}{${node.caption}}\n`
    : ''
  // eslint-disable-next-line max-len
  const headerProperties = typeof ctx.headerProperties === 'string' ? ctx.headerProperties : 'font=\\bfseries'
  let extraProps = ''

  if (headerCount && headerCount > 0) {
    const tableHeaderEnum = new Array(headerCount)
      .fill(0)
      .map((_, i) => i + 1)
      .join(',')
    extraProps += `,rowhead=${headerCount},row{${tableHeaderEnum}}={${headerProperties}}`
  }

  // eslint-disable-next-line max-len
  return `\\begin{${envName}}{colspec={${colHeader}}${extraProps}}\n${parsed.join('')}\\end{${envName}}${caption}\n`
}

/* Stringify a table `node`. */
function table (ctx, node) {
  const macro = ctx.table || defaultMacro
  const overriddenCtx = clone(ctx)

  overriddenCtx.image = overriddenCtx.image ? overriddenCtx.image : {}
  overriddenCtx.image.inlineMatcher = () => true

  return macro(overriddenCtx, node)
}
