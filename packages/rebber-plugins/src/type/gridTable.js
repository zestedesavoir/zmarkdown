/* Dependencies. */
const clone = require('clone')

const tableCell = require('rebber/dist/types/tableCell')
const tableRow = require('rebber/dist/types/tableRow')
const table = require('rebber/dist/types/table')
const text = require('rebber/dist/types/text')
const paragraph = require('rebber/dist/types/paragraph')

/* Expose. */
module.exports = gridTable

class MultiRowLine {
  constructor (startRow, endRow, startCell, endCell, colSpan, endOfLine) {
    this.multilineCounter = endRow - startRow
    this.startCell = startCell
    this.endCell = endCell
    this.colSpan = colSpan
    this.endOfLine = endOfLine
  }

  getCLine () {
    let startCLine = 1
    let endCLine = this.startCell - 1
    // case where the multi row line is at the start of the table
    if (this.startCell === 1) {
      startCLine = this.startCell + this.colSpan
      endCLine = this.endOfLine
    } else if (this.startCell > 1 && (this.startCell + this.colSpan) < this.endOfLine) {
      // case where the multi row line is in the middle of the table
      const clineBefore = `\\cline{1-${this.startCell - 1}}`
      const clineAfter = `\\cline{${this.startCell + this.colSpan}-${this.endOfLine}}`
      return `${clineBefore} ${clineAfter}`
    }
    return `\\cline{${startCLine}-${endCLine}}`
  }
}

class GridTableStringifier {
  constructor () {
    this.lastMultiRowLine = null
    this.currentSpan = 0
    this.rowIndex = 0
    this.colIndex = 0
    this.multiLineCellIndex = 0
    this.colSpan = 1
    this.nbOfColumns = 0
  }

  gridTableCell (ctx, node) {
    const overriddenCtx = clone(ctx)
    this.colIndex++
    overriddenCtx.tableCell = undefined
    // we have to replace \n by \endgraf only in text node, not in other
    // see #352
    overriddenCtx.overrides.text = (c, n, index, parent) => text(c, n, index, parent)
      .replace(/\n/g, ' \\endgraf ')
    overriddenCtx.overrides.paragraph = (c, n) => `${paragraph(c, n).trim()} \\endgraf \\endgraf `
    let baseText = tableCell(overriddenCtx, node).trim()
    while (baseText.substring(baseText.length - '\\endgraf'.length) === '\\endgraf') {
      baseText = baseText.substring(0, baseText.length - '\\endgraf'.length).trim()
    }
    if (node.data && node.data.hProperties.rowSpan > 1) {
      this.currentSpan = node.data.hProperties.rowSpan
      this.multiLineCellIndex = this.colIndex
      baseText = `\\multirow{${this.currentSpan}}{*}{\\parbox{\\linewidth}{${baseText}}}`
      this.colSpan = node.data.hProperties.colSpan > 1 ? node.data.hProperties.colSpan : 1
    } else if (node.data && node.data.hProperties.colSpan > 1) {
      const colSpan = node.data.hProperties.colSpan
      const colDim = `m{\\dimexpr(\\linewidth) * ${colSpan} / \\number-of-column - 2 * \\tabcolsep}`
      baseText = `\\multicolumn{${colSpan}}{|${colDim}|}{\\parbox{\\linewidth}{${baseText}}}`
    }

    if (node.data && node.data.hProperties.colSpan > 1) {
      this.colIndex -= 1
      this.colIndex += node.data.hProperties.colSpan
    }

    return baseText
  }

  gridTableRow (ctx, node, index) {
    const overriddenCtx = clone(ctx)
    this.rowIndex++
    overriddenCtx.tableRow = undefined
    if (this.previousRowWasMulti()) {
      const lastMultiRowline = this.flushMultiRowLineIfNeeded()
      for (let i = 0; i < lastMultiRowline.colSpan; i++) {
        node.children.splice(lastMultiRowline.startCell - 1, 0, {
          type: 'tableCell',
          children: [{
            type: 'paragraph',
            children: [{
              type: 'text',
              value: ' '
            }]
          }]
        })
      }
      this.colIndex = 0
      let rowStr = tableRow(overriddenCtx, node, index)
      if (lastMultiRowline.multilineCounter > 0) {
        rowStr = rowStr.replace(/\\hline/, lastMultiRowline.getCLine())
      }
      this.colIndex = 0
      return rowStr
    }

    let rowText = tableRow(overriddenCtx, node, index)
    if (this.currentSpan !== 0) {
      this.lastMultiRowLine = new MultiRowLine(
        this.rowIndex,
        this.rowIndex + this.currentSpan + (-1),
        this.multiLineCellIndex,
        this.colIndex + this.colSpan,
        this.colSpan,
        this.colIndex
      )
      rowText = rowText.replace(/\\hline/, this.lastMultiRowLine.getCLine())
    }
    this.currentSpan = 0
    if (this.colIndex >= this.nbOfColumns) {
      this.nbOfColumns = this.colIndex
    }
    this.colIndex = 0
    return rowText
  }

  flushMultiRowLineIfNeeded () {
    if (!this.lastMultiRowLine) {
      return null
    }
    const row = this.lastMultiRowLine
    if (row.multilineCounter >= 1) {
      row.multilineCounter--
    }
    if (row.multilineCounter === 0) {
      this.lastMultiRowLine = null
    }
    return row
  }

  gridTableHeaderParse () {
    return `|m{\\dimexpr(\\linewidth) / ${this.nbOfColumns} - 2 * \\tabcolsep}`
      .repeat(this.nbOfColumns)
      .concat('|')
  }

  previousRowWasMulti () {
    return this.lastMultiRowLine !== null
  }
}

function gridTable (ctx, node) {
  const overriddenCtx = clone(ctx)
  overriddenCtx.spreadCell = ''
  const stringifier = new GridTableStringifier()
  overriddenCtx.break = () => ' \\endgraf' // in gridtables '\\\\' won't work
  overriddenCtx.tableCell = stringifier.gridTableCell.bind(stringifier)
  overriddenCtx.tableRow = stringifier.gridTableRow.bind(stringifier)
  overriddenCtx.headerParse = stringifier.gridTableHeaderParse.bind(stringifier)

  overriddenCtx.image = overriddenCtx.image ? overriddenCtx.image : {}
  overriddenCtx.image.inlineMatcher = () => true

  return table(overriddenCtx, node).replace(/\\number-of-column/gm, stringifier.nbOfColumns)
}
