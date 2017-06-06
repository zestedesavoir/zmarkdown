module.exports = function plugin () {
  const mainLineRegex = new RegExp(/((\+)|(\|)).+((\|)|(\+))/)
  const totalMainLineRegex = new RegExp(/^((\+)|(\|)).+((\|)|(\+))$/)
  const headerLineRegex = new RegExp(/^\+=[=+]+=\+$/)
  const partLineRegex = new RegExp(/\+\-[-+]+\-\+/)
  const separationLineRegex = new RegExp(/^\+\-[-+]+\-\+$/)


  function extractTable (value, eat, tokenizer) {
    // Extract lines before grid table
    const possibleGridTable = value.split('\n')
    let i = 0;
    let before = [];
    for (; i < possibleGridTable.length; ++i) {
      const line = possibleGridTable[i]
      if (line.substring(0, 2) === '+-') break
      if (line.length > 0)
      before.push(line)
    }

    // Extract table
    const lineLength = possibleGridTable[i+1].length
    let gridTable = [];
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
            i -= 1;
          }
          break
        }
        gridTable.push(line);
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
        i -= 1;
      }
    }

    // Extract lines after table
    let after = [];
    for (; i < possibleGridTable.length; ++i) {
      const line = possibleGridTable[i]
      if (line.length > 0)
      after.push(line)
    }

    return [before, gridTable, after, hasHeader]
  }

  function merge(beforeTable, gridTable, afterTable) {
    //TODO tokenizer.tokenizeBlock(possibleGridTable[i], now)

    let total = beforeTable.join('\n')
    if (beforeTable.join('\n').length > 0 ) total += '\n'
    total += gridTable.join('\n')
    if (afterTable.join('\n').length > 0 ) total += '\n'
    total += afterTable.join('\n')
    return total
  }

  function isSeparationLine(line) {
    return separationLineRegex.exec(line)
  }

  function isHeaderLine(line) {
    return headerLineRegex.exec(line)
  }

  function isMainLine(line) {
    return mainLineRegex.exec(line)
  }

  function isPartLine(line) {
    return partLineRegex.exec(line)
  }

  function findAll(content, characters) {
    let pos = []
    for (let i = 0; i < content.length; ++i) {
      char = content[i]
      if (characters.indexOf(char) !== -1) {
        pos.push(i)
      }
    }
    return pos
  }

  function computePlainLineColumnsStartingPositions(line) {
    return findAll(line, '+|')
  }

  function computeMainLinesColumnsStartingPositions(lines) {
    let allPos = []
    lines.forEach(function (line) {
      allPos.push(findAll(line, '|'))
    })
    return mergeColumnsStartingPositions(allPos, false)
  }

  function mergeColumnsStartingPositions(allPos, strict = false) {
    if (allPos.length <= 1) return allPos
    let positions = []
    if (!strict) {
      positions = allPos[0]
    }

    allPos.forEach(function (posRow) {
      posRow.forEach(function (pos) {
        const idxOfPos = positions.indexOf(pos)
        if (idxOfPos === -1) {
          if (strict)
            positions.push(pos)
          else
            positions.splice(idxOfPos, 1)
        }
      })
    })

    return positions
  }

  function computeColumnStartingPositions(lines) {
    let linesInfo = []
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

  function gridTableTokenizer (eat, value, silent) {
    const keep = mainLineRegex.exec(value)
    if (!keep) return

    const [before, gridTable, after, hasHeader] = extractTable(value, eat, this)
    if (gridTable.length < 3) return

    const linesInfos = computeColumnStartingPositions(gridTable)
    console.log(linesInfos)

    console.log(gridTable)

    return eat(merge(before, gridTable, after))
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.grid_table = gridTableTokenizer
  blockMethods.splice(blockMethods.indexOf('fencedCode'), 0, 'grid_table')

}
