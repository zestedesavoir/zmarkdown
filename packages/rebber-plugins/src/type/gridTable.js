/* Dependencies. */
const clone = require('clone')

const tableCell = require('rebber/dist/types/tableCell')
const tableRow = require('rebber/dist/types/tableRow')
const table = require('rebber/dist/types/table')

/* Expose. */
module.exports = gridTable

class MultiRowLine {
  constructor (startRow, endRow, startCell, endCell, colspan, endOfLine) {
    this.multilineCounter = endRow - startRow
    this.startCell = startCell
    this.endCell = endCell
    this.colspan = colspan
    this.endOfLine = endOfLine
  }

  getCLine () {
    let startCLine = 1
    let endCLine = this.startCell - 1
    // case where the multi row line is at the start of the table
    if (this.startCell === 1) {
      startCLine = this.startCell + this.colspan
      endCLine = this.endOfLine
    } else if (this.startCell > 1 && (this.startCell + this.colspan) < this.endOfLine) {
      // case where the multi row line is in the middle of the table
      const clineBefore = `\\cline{1-${this.startCell - 1}}`
      const clineAfter = `\\cline{${this.startCell + this.colspan}-${this.endOfLine}}`
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
    this.colspan = 1
    this.nbOfColumns = 0
  }

  gridTableCell (ctx, node) {
    const overriddenCtx = clone(ctx)
    this.colIndex++
    overriddenCtx.tableCell = undefined
    let baseText = tableCell(overriddenCtx, node).trim().replace(/\n/g, ' \\par ')

    if (node.data && node.data.hProperties.rowspan > 1) {
      this.currentSpan = node.data.hProperties.rowspan
      this.multiLineCellIndex = this.colIndex
      baseText = `\\multirow{${node.data.hProperties.rowspan}}{*}{${baseText}}`
      this.colspan = node.data.hProperties.colspan > 1 ? node.data.hProperties.colspan : 1
    } else if (node.data && node.data.hProperties.colspan > 1) {
      const colspan = node.data.hProperties.colspan
      const colDim = `p{\\dimexpr(\\linewidth) * ${colspan} / \\number-of-column}`
      baseText = `\\multicolumn{${colspan}}{|${colDim}|}{${baseText}}`
    }

    if (node.data && node.data.hProperties.colspan > 1) {
      this.colIndex -= 1
      this.colIndex += node.data.hProperties.colspan
    }

    return baseText
  }

  gridTableRow (ctx, node) {
    const overriddenCtx = clone(ctx)
    this.rowIndex++
    overriddenCtx.tableRow = undefined
    if (this.previousRowWasMulti()) {
      const lastMultiRowline = this.flushMultiRowLineIfNeeded()
      for (let i = 0; i < lastMultiRowline.colspan; i++) {
        node.children.splice(lastMultiRowline.startCell - 1, 0, {
          type: 'tableCell',
          children: [{
            type: 'paragraph',
            children: [{
              type: 'text',
              value: ' ',
            }],
          }],
        })
      }
      this.colIndex = 0
      let rowStr = tableRow(overriddenCtx, node)
      if (lastMultiRowline.multilineCounter > 0) {
        rowStr = rowStr.replace(/\\hline/, lastMultiRowline.getCLine())
      }
      this.colIndex = 0
      return rowStr
    }

    let rowText = tableRow(overriddenCtx, node)
    if (this.currentSpan !== 0) {
      this.lastMultiRowLine = new MultiRowLine(
        this.rowIndex,
        this.rowIndex + this.currentSpan + (-1),
        this.multiLineCellIndex,
        this.colIndex + this.colspan,
        this.colspan,
        this.colIndex
      )
      rowText = rowText.replace(/\\hline/, this.lastMultiRowLine.getCLine())
    }
    this.currentSpan = 0
    if (this.colIndex >= this.nbOfColumns) {
      this.nbOfColumns = this.colIndex
    }
    this.colIndex = 0
    return rowText.replace(/\\number-of-column/, this.nbOfColumns)
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
    const headers = `|p{\\dimexpr(\\linewidth) / ${this.nbOfColumns}}`.repeat(this.nbOfColumns)
    return `${headers}|`
  }

  previousRowWasMulti () {
    return this.lastMultiRowLine !== null
  }
}

function gridTable (ctx, node) {
  const overriddenCtx = clone(ctx)
  overriddenCtx.spreadCell = ''
  const stringifier = new GridTableStringifier()
  overriddenCtx.break = () => ' \\par' // in gridtables '\\\\' won't work
  overriddenCtx.tableCell = stringifier.gridTableCell.bind(stringifier)
  overriddenCtx.tableRow = stringifier.gridTableRow.bind(stringifier)
  overriddenCtx.headerParse = stringifier.gridTableHeaderParse.bind(stringifier)
  return table(overriddenCtx, node)
}
