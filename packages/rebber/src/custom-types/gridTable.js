const baseCell = require('../types/tableCell')
const baseTable = require('../types/table')
const clone = require('clone')

module.exports = gridTable

function overridenTableCell (ctx, node) {
  const overridenCtx = clone(ctx)
  overridenCtx.tableCell = undefined
  let baseText = baseCell(overridenCtx, node).trim().replace(/\n/g, ' \\par ')
  if (node.data.hProperties.rowspan > 1) {
    baseText = `\\multirow{${node.data.hProperties.rowspan}}{*}{${baseText}}`
  } else if (node.data.hProperties.colspan > 1) {
    baseText = `\\multicolumn{${node.data.hProperties.colspan}}{|c|}{${baseText}}`
  }
  return baseText
}

function overridenHeaderParse (rows) {
  const lengths = rows.map(l => l.split('&').length)
  const cols = lengths.sort()[0]
  const headers = `|p{\\linewidth / ${cols}}`.repeat(cols)
  return `${headers}|`
}

function gridTable (ctx, node) {
  const overridenCtx = clone(ctx)
  overridenCtx.break = () => ' \\par' // in gridtables '\\\\' won't work
  overridenCtx.tableCell = overridenTableCell
  overridenCtx.headerParse = overridenHeaderParse
  return baseTable(overridenCtx, node)
}
