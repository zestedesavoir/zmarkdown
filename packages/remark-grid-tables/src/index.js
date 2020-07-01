const trimEnd = require('lodash.trimend')
const visit = require('unist-util-visit')
const stringWidth = require('string-width')
const splitter = new (require('grapheme-splitter'))()

const mainLineRegex = new RegExp(/((\+)|(\|)).+((\|)|(\+))/)
const totalMainLineRegex = new RegExp(
  /^((\+)|(\|)).+((\|)|(\+))$/
)
const headerLineRegex = new RegExp(/^\+=[=+]+=\+$/)
const partLineRegex = new RegExp(/\+-[-+]+-\+/)
const separationLineRegex = new RegExp(/^\+-[-+]+-\+$/)

module.exports = plugin

// A small class helping table generation
class Table {
  constructor (linesInfos) {
    this.parts = []
    this.linesInfos = linesInfos
    this.addPart()
  }

  lastPart () {
    return this.parts[this.parts.length - 1]
  }

  addPart () {
    this.parts.push(new TablePart(this.linesInfos))
  }
}

class TablePart {
  constructor (linesInfos) {
    this.rows = []
    this.linesInfos = linesInfos
    this.addRow()
  }

  addRow () {
    this.rows.push(new TableRow(this.linesInfos))
  }

  removeLastRow () {
    this.rows.pop()
  }

  lastRow () {
    return this.rows[this.rows.length - 1]
  }

  updateWithMainLine (line, isEndLine) {
    // Update last row according to a line.
    const mergeChars = isEndLine ? '+|' : '|'
    const newCells = [this.lastRow().cells[0]]

    this.lastRow()
      .cells.slice(1)
      .forEach((cell) => {
        // Only cells with rowspan equals can be merged
        // Test if the char does not compose a character
        // or the char before the cell is a separation character
        if (
          cell.rowspan ===
            newCells[newCells.length - 1].rowspan &&
          (!isCodePointPosition(
            line,
            cell.startPosition - 1
          ) ||
            !mergeChars.includes(
              substringLine(line, cell.startPosition - 1)
            ))
        ) {
          newCells[newCells.length - 1].mergeWith(cell)
        } else {
          newCells.push(cell)
        }
      })

    this.lastRow().cells = newCells
  }

  updateWithPartLine (line) {
    // Get cells not finished
    const remainingCells = []

    this.lastRow().cells.forEach((cell, c) => {
      const partLine = substringLine(
        line,
        cell.startPosition - 1,
        cell.endPosition + 1
      )

      if (!isSeparationLine(partLine)) {
        cell.lines.push(
          substringLine(
            line,
            cell.startPosition,
            cell.endPosition
          )
        )
        cell.rowspan += 1
        remainingCells.push(cell)
      }
    })
    // Generate new row
    this.addRow()

    const newCells = remainingCells.reduce(
      (sum, remainingCell) => {
        sum.push(
          ...this.lastRow().cells.filter(
            (cell) =>
              cell.endPosition <
                remainingCell.startPosition &&
              !sum.includes(cell)
          ),
          remainingCell,
          ...this.lastRow().cells.filter(
            (cell) =>
              cell.startPosition >
                remainingCell.endPosition &&
              !sum.includes(cell)
          )
        )

        return sum
      },
      []
    )

    // Remove duplicates
    for (let nc = 0; nc < newCells.length; nc++) {
      let newCell = newCells[nc]
      for (let ncc = 0; ncc < newCells.length; ncc++) {
        if (nc !== ncc) {
          const other = newCells[ncc]

          if (
            other.startPosition >= newCell.startPosition &&
            other.endPosition <= newCell.endPosition &&
            other.lines.length === 0
          ) {
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
    this.lastRow().cells = newCells
  }
}

class TableRow {
  constructor (linesInfos) {
    this.linesInfos = linesInfos
    this.cells = linesInfos
      .slice(0, -1)
      .map(
        (_, i) =>
          new TableCell(
            linesInfos[i] + 1,
            linesInfos[i + 1]
          )
      )
  }

  updateContent (line) {
    this.cells.forEach((cell, c) => {
      cell.lines.push(
        substringLine(
          line,
          cell.startPosition,
          cell.endPosition
        )
      )
    })
  }
}

class TableCell {
  constructor (startPosition, endPosition) {
    this.startPosition = startPosition
    this.endPosition = endPosition
    this.colspan = 1
    this.rowspan = 1
    this.lines = []
  }

  mergeWith (other) {
    this.endPosition = other.endPosition
    this.colspan += other.colspan

    this.lines = this.lines.map(
      (line, l) => `${line}|${other.lines[l]}`
    )
  }
}

function findIndexOrLast (
  arr,
  conditionFunction,
  modifier = 0
) {
  const i = arr.findIndex(conditionFunction)

  return i < 0 ? arr.length + modifier : i
}

function merge (beforeTable, gridTable, afterTable) {
  // get the eaten text
  return []
    .concat(beforeTable, gridTable, afterTable)
    .join('\n')
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

function findAll (str, characters) {
  let current = 0
  const content = splitter.splitGraphemes(str)

  return content.reduce((sum, char) => {
    if (characters.includes(char)) {
      sum.push(current)
    }
    current += stringWidth(char)

    return sum
  }, [])
}

function computePlainLineColumnsStartingPositions (line) {
  return findAll(line, '+|')
}

function mergeColumnsStartingPositions (allPos) {
  // Get all starting positions, allPos is an array of array of positions
  return allPos
    .flat()
    .reduce((sum, pos) => {
      if (!sum.includes(pos)) {
        sum.push(pos)
      }

      return sum
    }, [])
    .sort((a, b) => a - b)
}

function computeColumnStartingPositions (lines) {
  const linesInfo = lines
    .filter(
      (line) => isHeaderLine(line) || isPartLine(line)
    )
    .map((line) =>
      computePlainLineColumnsStartingPositions(line)
    )

  return mergeColumnsStartingPositions(linesInfo)
}

function isCodePointPosition (line, pos) {
  const content = splitter.splitGraphemes(line)
  let offset = 0

  for (let i = 0; i < content.length; i++) {
    // The pos points character position
    if (pos === offset) {
      return true
    }
    // The pos points non-character position
    if (pos < offset) {
      return false
    }
    offset += stringWidth(content[i])
  }

  // Reaching end means character position
  return true
}

function substringLine (line, start, end) {
  end = end || start + 1

  const content = splitter.splitGraphemes(line)
  let offset = 0
  let str = ''

  for (let i = 0; i < content.length; i++) {
    if (offset >= start) {
      str += content[i]
    }

    offset += stringWidth(content[i])

    if (offset >= end) {
      break
    }
  }

  return str
}

function extractTable (value, eat, tokenizer) {
  // Extract lines before the grid table
  const markdownLines = value.split('\n')

  const markdownStart = findIndexOrLast(
    markdownLines,
    (line) =>
      isSeparationLine(line) || stringWidth(line) === 0,
    -1
  )

  const before = markdownLines.slice(0, markdownStart)

  const possibleGridTable = markdownLines.map((line) =>
    trimEnd(line)
  )

  // Extract table
  if (!possibleGridTable[markdownStart + 1]) {
    return [null, null, null, null]
  }

  const gridTable = []
  const realGridTable = []
  let hasHeader = false

  let markdownStop = markdownStart

  for (
    ;
    markdownStop < possibleGridTable.length;
    markdownStop++
  ) {
    const line = possibleGridTable[markdownStop]
    // line is in table
    if (totalMainLineRegex.exec(line)) {
      const isHeaderLine = headerLineRegex.exec(line)
      if (isHeaderLine && !hasHeader) hasHeader = true
      // A table can't have 2 headers
      else if (isHeaderLine && hasHeader) {
        break
      }
      gridTable.push(line)
      realGridTable.push(markdownLines[markdownStop])
    } else {
      // this line is not in the grid table.
      break
    }
  }

  // if the last line is not a plain line
  if (
    !separationLineRegex.exec(
      gridTable[gridTable.length - 1]
    )
  ) {
    // Remove lines not in the table
    const index = findIndexOrLast(
      gridTable.slice().reverse(), // slice is to reverse a copy of the array
      (line) => isSeparationLine(line),
      0
    )

    markdownStop -= gridTable.splice(index - 1).length // splice return the deleted elements
  }

  // Extract lines after table
  const after = markdownLines.slice(
    markdownStop,
    findIndexOrLast(
      possibleGridTable,
      (line) => stringWidth(line) === 0
    )
  )

  return [
    before,
    gridTable,
    realGridTable,
    after,
    hasHeader,
  ]
}

function extractTableContent (lines, linesInfos, hasHeader) {
  const table = new Table(linesInfos)

  lines.forEach((line, lineIndex) => {
    // Get if the line separate the head of the table from the body
    const matchHeader =
      hasHeader & (isHeaderLine(line) !== null)
    // Get if the line close some cells
    const isEndLine =
      matchHeader | (isPartLine(line) !== null)

    if (isEndLine) {
      // It is a header, a plain line or a line with plain line part.
      // First, update the last row
      table.lastPart().updateWithMainLine(line, isEndLine)

      // Create the new row
      if (lineIndex !== 0) {
        if (matchHeader) {
          table.addPart()
        } else if (isSeparationLine(line)) {
          table.lastPart().addRow()
        } else {
          table.lastPart().updateWithPartLine(line)
        }
      }
      // update the last row
      table.lastPart().updateWithMainLine(line, isEndLine)
    } else {
      // it's a plain line
      table.lastPart().updateWithMainLine(line, isEndLine)
      table.lastPart().lastRow().updateContent(line)
    }
  })
  // Because the last line is a separation, the last row is always empty
  table.lastPart().removeLastRow()

  return table
}

function generateTable (tableContent, now, tokenizer) {
  // Generate the gridTable node to insert in the AST
  const tableElt = {
    type: 'gridTable',
    children: [],
    data: {
      hName: 'table',
    },
  }

  const hasHeader = tableContent.parts.length > 1

  tableElt.children = tableContent.parts.map(
    (part, partIndex) => {
      const partElt = {
        type: 'tableHeader',
        children: [],
        data: {
          hName:
            hasHeader && partIndex === 0
              ? 'thead'
              : 'tbody',
        },
      }

      partElt.children = part.rows.map((row, rowIndex) => {
        const rowElt = {
          type: 'tableRow',
          children: [],
          data: {
            hName: 'tr',
          },
        }

        rowElt.children = row.cells.map(
          (cell, cellIndex) => {
            const endLine = rowIndex + cell.rowspan
            if (
              cell.rowspan > 1 &&
              endLine - 1 < part.rows.length
            ) {
              /*
               *
               * Maybe need of refactorisation here, ^5 loop imbrication
               *
               */
              part.rows.forEach((ross, id) => {
                if (id >= 1 && id < cell.rowspan) {
                  const ross = part.rows[rowIndex + id]

                  ross.cells.forEach((other, cc) => {
                    if (
                      cell.startPosition ===
                        other.startPosition &&
                      cell.endPosition ===
                        other.endPosition &&
                      cell.colspan === other.colspan &&
                      cell.rowspan === other.rowspan &&
                      cell.lines === other.lines
                    ) {
                      ross.cells.splice(cc, 1)
                    }
                  })
                }
              })
            }

            /*
             *
             */

            const tokenizedContent = tokenizer.tokenizeBlock(
              cell.lines.map((e) => e.trim()).join('\n'),
              now
            )

            const cellElt = {
              type: 'tableCell',
              children: tokenizedContent,
              data: {
                hName:
                  hasHeader && partIndex === 0
                    ? 'th'
                    : 'td',
                hProperties: {
                  colspan: cell.colspan,
                  rowspan: cell.rowspan,
                },
              },
            }

            return cellElt
          }
        )
        return rowElt
      })
      return partElt
    }
  )

  return tableElt
}

function gridTableTokenizer (eat, value, silent) {
  const index = findIndexOrLast(
    value.split(),
    (character) => character !== ' ' && character !== '\t'
  )

  if (
    value.charAt(index) !== '+' ||
    value.charAt(index + 1) !== '-' ||
    !mainLineRegex.test(value)
  ) {
    return
  }

  const [
    before,
    gridTable,
    realGridTable,
    after,
    hasHeader,
  ] = extractTable(value, eat, this)

  if (!gridTable || gridTable.length < 3) return

  const now = eat.now()
  const linesInfos = computeColumnStartingPositions(
    gridTable
  )
  const tableContent = extractTableContent(
    gridTable,
    linesInfos,
    hasHeader
  )
  const tableElt = generateTable(tableContent, now, this)

  // Because we can't add multiples blocs in one eat, I use a temp block
  const wrapperBlock = {
    type: 'element',
    tagName: 'WrapperBlock',
    children: [],
  }

  const addBlock = (block) => {
    const tokens = this.tokenizeBlock(block.join('\n'), now)
    if (tokens.length) {
      wrapperBlock.children.push(tokens[0])
    }
  }

  if (before.length) addBlock(before)

  wrapperBlock.children.push(tableElt)

  if (after.length) addBlock(after)

  const merged = merge(before, realGridTable, after)

  return eat(merged)(wrapperBlock)
}

function deleteWrapperBlock () {
  return function one (node, index, parent) {
    if (!node.children) return

    let replace = false

    const newChildren = node.children.reduce(
      (sum, child) => {
        if (
          child.tagName === 'WrapperBlock' &&
          child.type === 'element'
        ) {
          replace = true
          sum = sum.concat(child.children)
        } else {
          sum.push(child)
        }

        return sum
      },
      []
    )

    if (replace) {
      node.children = newChildren
    }
  }
}

function transformer (tree) {
  // Remove the temporary block in which we previously wrapped the table parts
  visit(tree, deleteWrapperBlock())
}

function createGrid (nbRows, nbCols) {
  const grid = []

  for (let i = 0; i < nbRows; i++) {
    grid.push([])
    for (let j = 0; j < nbCols; j++) {
      grid[i].push({
        height: -1,
        width: -1,
        hasBottom: true,
        hasRigth: true,
      })
    }
  }

  return grid
}

function setWidth (grid, i, j, cols) {
  /* To do it, we put enougth space to write the text.
   * For multi-cell, we divid it among the cells. */
  let tmpWidth =
    Math.max(
      ...Array.from(grid[i][j].value).map((x) => x.length)
    ) + 2

  const row = grid[i]

  row.forEach((_, c) => {
    if (c < cols) {
      // To divid
      const localWidth = Math.ceil(tmpWidth / (cols - c)) // cols - c will be 1 for the last cell
      tmpWidth -= localWidth
      row[j + c].width = localWidth
    }
  })
}

function setHeight (grid, i, j, values) {
  // To do it, we count the line. Extra length to cell with a pipe
  // in the value of the last line, to not be confuse with a border.
  const row = grid[i]

  row[j].height = values.length
  // Extra line
  if (values[values.length - 1].indexOf('|') > 0) {
    row[j].height += 1
  }
}

function extractAST (gridNode, grid) {
  let i = 0
  /* Fill the grid with value, height and width from the ast */
  gridNode.children.forEach((th) => {
    th.children.forEach((row) => {
      row.children.forEach((cell, j) => {
        const row = grid[i]
        let X = 0 // x taking colspan and rowspan into account

        while (row[j + X].evaluated) X++
        row[j + X].value = this.all(cell)
          .join('\n\n') // these two lines need explaination
          .split('\n')

        setHeight(grid, i, j + X, row[j + X].value)
        setWidth(
          grid,
          i,
          j + X,
          cell.data.hProperties.colspan
        )

        // If it's empty, we fill it up with a useless space
        // Otherwise, it will not be parsed.
        const firstCell = grid[0][0]
        if (!firstCell.value.join('\n')) {
          firstCell.value = [' ']
          firstCell.width = 3
        }

        // Define the border of each cell
        for (
          let x = 0;
          x < cell.data.hProperties.rowspan;
          x++
        ) {
          for (
            let y = 0;
            y < cell.data.hProperties.colspan;
            y++
          ) {
            const anOtherCell = grid[i + x][j + X + y] // wich one ?

            // b attribute is for bottom
            anOtherCell.hasBottom =
              x + 1 === cell.data.hProperties.rowspan
            // r attribute is for right
            anOtherCell.hasRigth =
              y + 1 === cell.data.hProperties.colspan

            // set v if a cell has ever been define
            anOtherCell.evaluated = ' '
          }
        }
      })
      i++
    })
  })

  // If there are 2 differents tableHeader, so the first one is a header and
  // should be underlined
  if (gridNode.children.length > 1) {
    grid[
      gridNode.children[0].children.length - 1
    ][0].isHeader = true
  }
}

function setSize (grid) {
  // The idea is the max win

  // Set the height of each cell
  grid.forEach((row) => {
    // For each row

    // Find the max
    const maxHeight = Math.max(
      ...row.map((cell) => cell.height)
    )

    // Set it to each cell
    row.forEach((cell) => {
      cell.height = maxHeight
    })
  })

  // Set the width of each cell
  grid[0].forEach((firstRowCell, columnIndex) => {
    // For each column
    const column = grid.map((row) => row[columnIndex])

    // Find the largest cell
    const maxWidth = Math.max(
      ...column.map((cell) => cell.width)
    )

    // Set it to each cell
    column.forEach((cell) => (cell.width = maxWidth))
  })
}

function generateBorders (grid, nbRows, nbCols, gridString) {
  /** **** Create the borders *******/

  // Create the first line
  /*
   * We have to create the first line manually because
   * we process the borders from the attributes bottom
   * and right of each cell. For the first line, their
   * is no bottom nor right cell.
   *
   * We only need the right attribute of the first row's
   * cells
   */

  const first = `+${grid[0]
    .map(
      (cell, i) =>
        '-'.repeat(cell.width) +
        (cell.hasRigth || i === nbCols - 1 ? '+' : '-')
    )
    .join('')}`

  gridString.push(first)

  grid.forEach((row, i) => {
    // Cells lines
    // The inner of the cell
    let line = '|'

    row.forEach((cell) => {
      cell.y = gridString.length
      cell.x = line.length + 1
      line += ' '.repeat(cell.width)
      line += cell.hasRigth ? '|' : ' '
    })

    const firstCell = row[0]

    // Add line until the text can fit
    gridString.push(
      ...Array(Math.max(firstCell.height, 0)).fill(line)
    )

    // "End" line
    // It's the last line of the cell. Actually the border.
    line = firstCell.hasBottom ? '+' : '|'

    row.forEach((cell, j) => {
      let char = ' '

      if (cell.hasBottom) {
        if (firstCell.isHeader) {
          char = '='
        } else {
          char = '-'
        }
      }

      line += char.repeat(cell.width)

      if (
        cell.hasBottom ||
        (j + 1 < nbCols && grid[i][j + 1].hasBottom)
      ) {
        if (
          cell.hasRigth ||
          (i + 1 < nbRows && grid[i + 1][j].hasRigth)
        ) {
          line += '+'
        } else {
          line += firstCell.isHeader ? '=' : '-'
        }
      } else if (
        cell.hasRigth ||
        (i + 1 < nbRows && grid[i + 1][j].hasRigth)
      ) {
        line += '|'
      } else {
        line += ' '
      }
    })

    gridString.push(line)
  })
}

function writeText (grid, gridString) {
  grid.forEach((row) =>
    row
      .filter((cell) => cell.value && cell.value[0])
      .forEach((cell) =>
        cell.value.forEach((line, tmpCount) => {
          const tmpLine = cell.y + tmpCount
          const lineEdit = gridString[tmpLine]

          gridString[tmpLine] =
            lineEdit.substr(0, cell.x) +
            line +
            lineEdit.substr(cell.x + line.length)
        })
      )
  )
}

function stringifyGridTables (gridNode) {
  const gridString = []

  const nbRows = gridNode.children
    .map((th) => th.children.length)
    .reduce((a, b) => a + b)
  const nbCols = gridNode.children[0].children[0].children
    .map((c) => c.data.hProperties.colspan)
    .reduce((a, b) => a + b)

  const grid = createGrid(nbRows, nbCols)

  /* First, we extract the information
   * then, we set the size(2) of the border
   * and create it(3).
   * Finaly we fill it up.
   */

  extractAST.bind(this)(gridNode, grid)

  setSize(grid)

  generateBorders(grid, nbRows, nbCols, gridString)

  writeText(grid, gridString)

  return gridString.join('\n')
}

function plugin () {
  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods

  blockTokenizers.gridTable = gridTableTokenizer
  blockMethods.splice(
    blockMethods.indexOf('fencedCode') + 1,
    0,
    'gridTable'
  )

  const Compiler = this.Compiler

  // Stringify
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    if (!visitors) return

    visitors.gridTable = stringifyGridTables
  }

  return transformer
}
