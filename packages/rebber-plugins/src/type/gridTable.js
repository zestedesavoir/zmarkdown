/* Dependencies. */
const baseCell = require('rebber/dist/types/tableCell')
const baseTable = require('rebber/dist/types/table')
const clone = require('clone')

/* Expose. */
module.exports = gridTable

function overriddenTableCell (ctx, node) {
  const overriddenCtx = clone(ctx)
  overriddenCtx.tableCell = undefined
  let baseText = baseCell(overriddenCtx, node).trim().replace(/\n/g, ' \\par ')
  if (node.data.hProperties.rowspan > 1) {
    baseText = `\\multirow{${node.data.hProperties.rowspan}}{*}{${baseText}}`
  } else if (node.data.hProperties.colspan > 1) {
    baseText = `\\multicolumn{${node.data.hProperties.colspan}}{|c|}{${baseText}}`
  }
  return baseText
}

function overriddenHeaderParse (rows) {
  const lengths = rows.map(l => l.split('&').length)
  const cols = lengths.sort()[0]
  const headers = `|p{\\linewidth / ${cols}}`.repeat(cols)
  return `${headers}|`
}

function gridTable (ctx, node) {
  const overriddenCtx = clone(ctx)
  overriddenCtx.break = () => ' \\par' // in gridtables '\\\\' won't work
  overriddenCtx.tableCell = overriddenTableCell
  overriddenCtx.headerParse = overriddenHeaderParse
  return baseTable(overriddenCtx, node)
}
