const visit = require('unist-util-visit')

module.exports = function plugin () {
  const mainLineRegex = new RegExp(/((\+)|(\|)).+((\|)|(\+))/)
  const totalMainLineRegex = new RegExp(/^((\+)|(\|)).+((\|)|(\+))$/)
  const headerLineRegex = new RegExp(/^\+=[=+]+=\+$/)
  const partLineRegex = new RegExp(/\+-[-+]+-\+/)
  const separationLineRegex = new RegExp(/^\+-[-+]+-\+$/)


  function extractTable (value, eat, tokenizer) {
    // Extract lines before grid table
    const possibleGridTable = value.split('\n')
    let i = 0
    const before = []
    for (; i < possibleGridTable.length; ++i) {
      const line = possibleGridTable[i]
      if (isSeparationLine(line)) break
      if (line.length === 0) break
      before.push(line)
    }

    // Extract table
    if (!possibleGridTable[i + 1]) return [null, null, null, null]
    const lineLength = possibleGridTable[i + 1].length
    const gridTable = []
    let hasHeader = false
    for (; i < possibleGridTable.length; ++i) {
      const line = possibleGridTable[i]
      const isMainLine = totalMainLineRegex.exec(line)
      // line is in table
      if (isMainLine && line.length === lineLength) {
        const isHeaderLine = headerLineRegex.exec(line)
        if (isHeaderLine && !hasHeader) hasHeader = true
        // A table can't have 2 headers
        else if (isHeaderLine && hasHeader) {
          // Remove line not in table
          for (let j = gridTable.length - 1; j >= 0; --j) {
            const isSeparation = separationLineRegex.exec(gridTable[j])
            if (isSeparation) break
            gridTable.pop()
            i--
          }
          break
        }
        gridTable.push(line)
      } else {
        // this line is not in the grid table.
        break
      }
    }

    // if last line is not a plain line
    if (!separationLineRegex.exec(gridTable[gridTable.length - 1])) {
      // Remove line not in table
      for (let j = gridTable.length - 1; j >= 0; --j) {
        const isSeparation = separationLineRegex.exec(gridTable[j])
        if (isSeparation) break
        gridTable.pop()
        i -= 1
      }
    }

    // Extract lines after table
    const after = []
    for (; i < possibleGridTable.length; ++i) {
      const line = possibleGridTable[i]
      if (line.length === 0) break
      after.push(line)
    }

    return [before, gridTable, after, hasHeader]
  }

  function merge (beforeTable, gridTable, afterTable) {
    let total = beforeTable.join('\n')
    if (beforeTable.join('\n').length > 0) {
      total += '\n'
    }
    total += gridTable.join('\n')
    if (afterTable.join('\n').length > 0) {
      total += '\n'
    }
    total += afterTable.join('\n')
    return total
  }

  function isSeparationLine (line) {
    return separationLineRegex.exec(line)
  }

  function isHeaderLine (line) {
    return headerLineRegex.exec(line)
  }

  function isPartLine (line) {
    return partLineRegex.exec(line)
  }

  function findAll (content, characters) {
    const pos = []
    for (let i = 0; i < content.length; ++i) {
      const char = content[i]
      if (characters.indexOf(char) !== -1) {
        pos.push(i)
      }
    }
    return pos
  }

  function computePlainLineColumnsStartingPositions (line) {
    return findAll(line, '+|')
  }

  function mergeColumnsStartingPositions (allPos) {
    const positions = []

    allPos.forEach(function (posRow) {
      posRow.forEach(function (pos) {
        const idxOfPos = positions.indexOf(pos)
        if (idxOfPos === -1) {
          positions.push(pos)
        }
      })
    })

    return positions.sort(function (a, b) {
      return a - b
    })
  }

  function computeColumnStartingPositions (lines) {
    const linesInfo = []
    let stackLines = []

    lines.forEach(function (line) {
      if (isHeaderLine(line) || isPartLine(line)) {
        if (stackLines.length > 0) {
          linesInfo.push(computePlainLineColumnsStartingPositions(stackLines))
          stackLines = []
        }
        linesInfo.push(computePlainLineColumnsStartingPositions(line))
      } else {
        stackLines.push(line)
      }
    })

    return mergeColumnsStartingPositions(linesInfo)
  }

  const Table = function (linesInfos) {
    this._parts = []
    this._linesInfos = linesInfos
    this.addPart()
  }

  Table.prototype.lastPart = function () {
    return this._parts[this._parts.length - 1]
  }

  Table.prototype.addPart = function () {
    this._parts.push(new TablePart(this._linesInfos))
  }

  let TablePart = function (linesInfos) {
    this._rows = []
    this._linesInfos = linesInfos
    this.addRow()
  }

  TablePart.prototype.addRow = function () {
    this._rows.push(new TableRow(this._linesInfos))
  }

  TablePart.prototype.removeLastRow = function () {
    this._rows.pop()
  }

  TablePart.prototype.lastRow = function () {
    return this._rows[this._rows.length - 1]
  }

  TablePart.prototype.updateWithMainLine = function (line, isEndLine) {
    const mergeChars = isEndLine ? '+|' : '|'
    const newCells = [this.lastRow()._cells[0]]
    for (let c = 1; c < this.lastRow()._cells.length; ++c) {
      const cell = this.lastRow()._cells[c]

      // Only cells with rowspan equals can be merged
      if (cell._rowspan === newCells[newCells.length - 1]._rowspan &&
      mergeChars.indexOf(line[cell._startPosition - 1]) === -1) {
        newCells[newCells.length - 1].mergeWith(cell)
      } else {
        newCells.push(cell)
      }
    }
    this.lastRow()._cells = newCells
  }

  TablePart.prototype.updateWithPartLine = function (line) {
    const remainingCells = []
    for (let c = 0; c < this.lastRow()._cells.length; ++c) {
      const cell = this.lastRow()._cells[c]
      const partLine = line.substring(cell._startPosition - 1, cell._endPosition + 1)
      if (!isSeparationLine(partLine)) {
        cell._lines.push(line.substring(cell._startPosition, cell._endPosition))
        cell._rowspan += 1
        remainingCells.push(cell)
      }
    }
    this.addRow()
    const newCells = []
    for (let c = 0; c < remainingCells.length; ++c) {
      const remainingCell = remainingCells[c]
      for (let cc = 0; cc < this.lastRow()._cells.length; ++cc) {
        const cell = this.lastRow()._cells[cc]
        if (cell._endPosition < remainingCell._startPosition && newCells.indexOf(cell) === -1) {
          newCells.push(cell)
        }
      }
      newCells.push(remainingCell)
      for (let cc = 0; cc < this.lastRow()._cells.length; ++cc) {
        const cell = this.lastRow()._cells[cc]
        if (cell._startPosition > remainingCell._endPosition && newCells.indexOf(cell) === -1) {
          newCells.push(cell)
        }
      }
    }

    // Remove duplicates
    for (let nc = 0; nc < newCells.length; ++nc) {
      let newCell = newCells[nc]
      for (let ncc = 0; ncc < newCells.length; ++ncc) {
        if (nc !== ncc) {
          const other = newCells[ncc]
          if (other._startPosition >= newCell._startPosition &&
          other._endPosition <= newCell._endPosition) {
            if (other._lines.length === 0) {
              newCells.splice(ncc, 1)
              ncc -= 1
              if (nc > ncc) {
                nc -= 1
                newCell = newCells[nc]
              }
            }
          }
        }
      }
    }

    this.lastRow()._cells = newCells
  }

  let TableRow = function (linesInfos) {
    this._linesInfos = linesInfos
    this._cells = []
    for (let i = 0; i < linesInfos.length - 1; ++i) {
      this._cells.push(new TableCell(linesInfos[i] + 1, linesInfos[i + 1]))
    }
  }

  TableRow.prototype.updateContent = function (line) {
    for (let c = 0; c < this._cells.length; ++c) {
      const cell = this._cells[c]
      cell._lines.push(line.substring(cell._startPosition, cell._endPosition))
    }
  }

  let TableCell = function (startPosition, endPosition) {
    this._startPosition = startPosition
    this._endPosition = endPosition
    this._colspan = 1
    this._rowspan = 1
    this._lines = []
  }

  TableCell.prototype.mergeWith = function (other) {
    this._endPosition = other._endPosition
    this._colspan += other._colspan
    const newLines = []
    for (let l = 0; l < this._lines.length; ++l) {
      newLines.push(`${this._lines[l]}|${other._lines[l]}`)
    }
    this._lines = newLines
  }

  function extractTableContent (lines, linesInfos, hasHeader) {
    const table = new Table(linesInfos)

    for (let l = 0; l < lines.length; ++l) {
      const line = lines[l]
      const matchHeader = hasHeader & isHeaderLine(line) !== null
      const isEndLine = matchHeader | isPartLine(line) !== null

      if (isEndLine) {
        table.lastPart().updateWithMainLine(line, isEndLine)

        if (l !== 0) {
          if (matchHeader) {
            table.addPart()
          } else if (isSeparationLine(line)) {
            table.lastPart().addRow()
          } else {
            table.lastPart().updateWithPartLine(line)
          }
        }
        table.lastPart().updateWithMainLine(line, isEndLine)
      } else {
        table.lastPart().updateWithMainLine(line, isEndLine)
        table.lastPart().lastRow().updateContent(line)
      }
    }
    table.lastPart().removeLastRow()
    return table
  }

  function generateTable (tableContent, now, tokenizer) {
    const tableWrapper = {
      type: 'element',
      children: [],
      data: {
        hName: 'div',
        hProperties: {
          class: 'table-wrapper'
        }
      }
    }
    const tableElt = {
      type: 'gridTable',
      children: [],
      data: {
        hName: 'table',
      }
    }

    const hasHeader = tableContent._parts.length > 1

    for (let p = 0; p < tableContent._parts.length; ++p) {
      const part = tableContent._parts[p]
      const partElt = {
        type: 'gridTableHeader',
        children: [],
        data: {
          hName: (hasHeader && p === 0) ? 'thead' : 'tbody',
        }
      }
      for (let r = 0; r < part._rows.length; ++r) {
        const row = part._rows[r]
        const rowElt = {
          type: 'gridTableRow',
          children: [],
          data: {
            hName: 'tr',
          }
        }
        for (let c = 0; c < row._cells.length; ++c) {
          const cell = row._cells[c]
          const cellElt = {
            type: 'gridTableCell',
            children: tokenizer.tokenizeBlock(cell._lines.map(function (e) {
              return e.trim()
            }).join('\n'), now),
            data: {
              hName: (hasHeader && p === 0) ? 'th' : 'td',
              hProperties: {
                colspan: cell._colspan,
                rowspan: cell._rowspan,
              },
            }
          }

          const endLine = r + cell._rowspan
          if (cell._rowspan > 1 && endLine - 1 < part._rows.length) {
            for (let rs = 1; rs < cell._rowspan; ++rs) {
              for (let cc = 0; cc < part._rows[r + rs]._cells.length; ++cc) {
                const other = part._rows[r + rs]._cells[cc]
                if (cell._startPosition === other._startPosition &&
                cell._endPosition === other._endPosition &&
                cell._colspan === other._colspan &&
                cell._rowspan === other._rowspan &&
                cell._lines === other._lines) {
                  part._rows[r + rs]._cells.splice(cc, 1)
                }
              }
            }
          }

          rowElt.children.push(cellElt)
        }
        partElt.children.push(rowElt)
      }
      tableElt.children.push(partElt)
    }

    tableWrapper.children.push(tableElt)

    return tableWrapper
  }

  function gridTableTokenizer (eat, value, silent) {
    const keep = mainLineRegex.exec(value)
    if (!keep) return

    const [before, gridTable, after, hasHeader] = extractTable(value, eat, this)
    if (!gridTable || gridTable.length < 3) return

    const now = eat.now()

    const linesInfos = computeColumnStartingPositions(gridTable)

    const tableContent = extractTableContent(gridTable, linesInfos, hasHeader)
    const tableElt = generateTable(tableContent, now, this)
    const merged = merge(before, gridTable, after)

    const wrapperBlock = {
      type: 'element',
      tagName: 'WrapperBlock',
      children: []
    }
    if (before.length > 0) {
      wrapperBlock.children.push(this.tokenizeBlock(before.join('\n'), now)[0])
    }
    wrapperBlock.children.push(tableElt)
    if (after.length > 0) {
      wrapperBlock.children.push(this.tokenizeBlock(after.join('\n'), now)[0])
    }
    return eat(merged)(wrapperBlock)
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.grid_table = gridTableTokenizer
  blockMethods.splice(blockMethods.indexOf('fencedCode'), 0, 'grid_table')

  function transformer (tree) {
    visit(tree, deleteWrapperBlock())
  }

  function deleteWrapperBlock () {
    function one (node, index, parent) {
      if (!node.children) return

      // If a text node is present in child nodes, check if an abbreviation is present
      const newChildren = []
      let replace = false
      for (let c = 0; c < node.children.length; ++c) {
        const child = node.children[c]
        if (child.tagName === 'WrapperBlock' && child.type === 'element') {
          replace = true
          for (let cc = 0; cc < child.children.length; ++cc) {
            newChildren.push(child.children[cc])
          }
        } else {
          newChildren.push(child)
        }
      }
      if (replace) {
        node.children = newChildren
      }
    }
    return one
  }

  return transformer
}
