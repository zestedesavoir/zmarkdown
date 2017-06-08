'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var visit = require('unist-util-visit');

module.exports = function plugin() {
  var mainLineRegex = new RegExp(/((\+)|(\|)).+((\|)|(\+))/);
  var totalMainLineRegex = new RegExp(/^((\+)|(\|)).+((\|)|(\+))$/);
  var headerLineRegex = new RegExp(/^\+=[=+]+=\+$/);
  var partLineRegex = new RegExp(/\+-[-+]+-\+/);
  var separationLineRegex = new RegExp(/^\+-[-+]+-\+$/);

  function extractTable(value, eat, tokenizer) {
    // Extract lines before grid table
    var possibleGridTable = value.split('\n');
    var i = 0;
    var before = [];
    for (; i < possibleGridTable.length; ++i) {
      var line = possibleGridTable[i];
      if (isSeparationLine(line)) break;
      if (line.length === 0) break;
      before.push(line);
    }

    // Extract table
    if (!possibleGridTable[i + 1]) return [null, null, null, null];
    var lineLength = possibleGridTable[i + 1].length;
    var gridTable = [];
    var hasHeader = false;
    for (; i < possibleGridTable.length; ++i) {
      var _line = possibleGridTable[i];
      var isMainLine = totalMainLineRegex.exec(_line
      // line is in table
      );if (isMainLine && _line.length === lineLength) {
        var _isHeaderLine = headerLineRegex.exec(_line);
        if (_isHeaderLine && !hasHeader) hasHeader = true;
        // A table can't have 2 headers
        else if (_isHeaderLine && hasHeader) {
            // Remove line not in table
            for (var j = gridTable.length - 1; j >= 0; --j) {
              var isSeparation = separationLineRegex.exec(gridTable[j]);
              if (isSeparation) break;
              gridTable.pop();
              i--;
            }
            break;
          }
        gridTable.push(_line);
      } else {
        // this line is not in the grid table.
        break;
      }
    }

    // if last line is not a plain line
    if (!separationLineRegex.exec(gridTable[gridTable.length - 1])) {
      // Remove line not in table
      for (var _j = gridTable.length - 1; _j >= 0; --_j) {
        var _isSeparation = separationLineRegex.exec(gridTable[_j]);
        if (_isSeparation) break;
        gridTable.pop();
        i -= 1;
      }
    }

    // Extract lines after table
    var after = [];
    for (; i < possibleGridTable.length; ++i) {
      var _line2 = possibleGridTable[i];
      if (_line2.length === 0) break;
      after.push(_line2);
    }

    return [before, gridTable, after, hasHeader];
  }

  function merge(beforeTable, gridTable, afterTable) {
    var total = beforeTable.join('\n');
    if (beforeTable.join('\n').length > 0) {
      total += '\n';
    }
    total += gridTable.join('\n');
    if (afterTable.join('\n').length > 0) {
      total += '\n';
    }
    total += afterTable.join('\n');
    return total;
  }

  function isSeparationLine(line) {
    return separationLineRegex.exec(line);
  }

  function isHeaderLine(line) {
    return headerLineRegex.exec(line);
  }

  function isPartLine(line) {
    return partLineRegex.exec(line);
  }

  function findAll(content, characters) {
    var pos = [];
    for (var i = 0; i < content.length; ++i) {
      var char = content[i];
      if (characters.indexOf(char) !== -1) {
        pos.push(i);
      }
    }
    return pos;
  }

  function computePlainLineColumnsStartingPositions(line) {
    return findAll(line, '+|');
  }

  function mergeColumnsStartingPositions(allPos) {
    var positions = [];

    allPos.forEach(function (posRow) {
      posRow.forEach(function (pos) {
        var idxOfPos = positions.indexOf(pos);
        if (idxOfPos === -1) {
          positions.push(pos);
        }
      });
    });

    return positions.sort(function (a, b) {
      return a - b;
    });
  }

  function computeColumnStartingPositions(lines) {
    var linesInfo = [];
    var stackLines = [];

    lines.forEach(function (line) {
      if (isHeaderLine(line) || isPartLine(line)) {
        if (stackLines.length > 0) {
          linesInfo.push(computePlainLineColumnsStartingPositions(stackLines));
          stackLines = [];
        }
        linesInfo.push(computePlainLineColumnsStartingPositions(line));
      } else {
        stackLines.push(line);
      }
    });

    return mergeColumnsStartingPositions(linesInfo);
  }

  var Table = function Table(linesInfos) {
    this._parts = [];
    this._linesInfos = linesInfos;
    this.addPart();
  };

  Table.prototype.lastPart = function () {
    return this._parts[this._parts.length - 1];
  };

  Table.prototype.addPart = function () {
    this._parts.push(new TablePart(this._linesInfos));
  };

  var TablePart = function TablePart(linesInfos) {
    this._rows = [];
    this._linesInfos = linesInfos;
    this.addRow();
  };

  TablePart.prototype.addRow = function () {
    this._rows.push(new TableRow(this._linesInfos));
  };

  TablePart.prototype.removeLastRow = function () {
    this._rows.pop();
  };

  TablePart.prototype.lastRow = function () {
    return this._rows[this._rows.length - 1];
  };

  TablePart.prototype.updateWithMainLine = function (line, isEndLine) {
    var mergeChars = isEndLine ? '+|' : '|';
    var newCells = [this.lastRow()._cells[0]];
    for (var c = 1; c < this.lastRow()._cells.length; ++c) {
      var cell = this.lastRow()._cells[c];

      // Only cells with rowspan equals can be merged
      if (cell._rowspan === newCells[newCells.length - 1]._rowspan && mergeChars.indexOf(line[cell._startPosition - 1]) === -1) {
        newCells[newCells.length - 1].mergeWith(cell);
      } else {
        newCells.push(cell);
      }
    }
    this.lastRow()._cells = newCells;
  };

  TablePart.prototype.updateWithPartLine = function (line) {
    var remainingCells = [];
    for (var c = 0; c < this.lastRow()._cells.length; ++c) {
      var cell = this.lastRow()._cells[c];
      var partLine = line.substring(cell._startPosition - 1, cell._endPosition + 1);
      if (!isSeparationLine(partLine)) {
        cell._lines.push(line.substring(cell._startPosition, cell._endPosition));
        cell._rowspan += 1;
        remainingCells.push(cell);
      }
    }
    this.addRow();
    var newCells = [];
    for (var _c = 0; _c < remainingCells.length; ++_c) {
      var remainingCell = remainingCells[_c];
      for (var cc = 0; cc < this.lastRow()._cells.length; ++cc) {
        var _cell = this.lastRow()._cells[cc];
        if (_cell._endPosition < remainingCell._startPosition && newCells.indexOf(_cell) === -1) {
          newCells.push(_cell);
        }
      }
      newCells.push(remainingCell);
      for (var _cc = 0; _cc < this.lastRow()._cells.length; ++_cc) {
        var _cell2 = this.lastRow()._cells[_cc];
        if (_cell2._startPosition > remainingCell._endPosition && newCells.indexOf(_cell2) === -1) {
          newCells.push(_cell2);
        }
      }
    }

    // Remove duplicates
    for (var nc = 0; nc < newCells.length; ++nc) {
      var newCell = newCells[nc];
      for (var ncc = 0; ncc < newCells.length; ++ncc) {
        if (nc !== ncc) {
          var other = newCells[ncc];
          if (other._startPosition >= newCell._startPosition && other._endPosition <= newCell._endPosition) {
            if (other._lines.length === 0) {
              newCells.splice(ncc, 1);
              ncc -= 1;
              if (nc > ncc) {
                nc -= 1;
                newCell = newCells[nc];
              }
            }
          }
        }
      }
    }

    this.lastRow()._cells = newCells;
  };

  var TableRow = function TableRow(linesInfos) {
    this._linesInfos = linesInfos;
    this._cells = [];
    for (var i = 0; i < linesInfos.length - 1; ++i) {
      this._cells.push(new TableCell(linesInfos[i] + 1, linesInfos[i + 1]));
    }
  };

  TableRow.prototype.updateContent = function (line) {
    for (var c = 0; c < this._cells.length; ++c) {
      var cell = this._cells[c];
      cell._lines.push(line.substring(cell._startPosition, cell._endPosition));
    }
  };

  var TableCell = function TableCell(startPosition, endPosition) {
    this._startPosition = startPosition;
    this._endPosition = endPosition;
    this._colspan = 1;
    this._rowspan = 1;
    this._lines = [];
  };

  TableCell.prototype.mergeWith = function (other) {
    this._endPosition = other._endPosition;
    this._colspan += other._colspan;
    var newLines = [];
    for (var l = 0; l < this._lines.length; ++l) {
      newLines.push(this._lines[l] + '|' + other._lines[l]);
    }
    this._lines = newLines;
  };

  function extractTableContent(lines, linesInfos, hasHeader) {
    var table = new Table(linesInfos);

    for (var l = 0; l < lines.length; ++l) {
      var line = lines[l];
      var matchHeader = hasHeader & isHeaderLine(line) !== null;
      var isEndLine = matchHeader | isPartLine(line) !== null;

      if (isEndLine) {
        table.lastPart().updateWithMainLine(line, isEndLine);

        if (l !== 0) {
          if (matchHeader) {
            table.addPart();
          } else if (isSeparationLine(line)) {
            table.lastPart().addRow();
          } else {
            table.lastPart().updateWithPartLine(line);
          }
        }
        table.lastPart().updateWithMainLine(line, isEndLine);
      } else {
        table.lastPart().updateWithMainLine(line, isEndLine);
        table.lastPart().lastRow().updateContent(line);
      }
    }
    table.lastPart().removeLastRow();
    return table;
  }

  function generateTable(tableContent, now, tokenizer) {
    var tableWrapper = {
      type: 'element',
      children: [],
      data: {
        hName: 'div',
        hProperties: {
          class: 'table-wrapper'
        }
      }
    };
    var tableElt = {
      type: 'gridTable',
      children: [],
      data: {
        hName: 'table'
      }
    };

    var hasHeader = tableContent._parts.length > 1;

    for (var p = 0; p < tableContent._parts.length; ++p) {
      var part = tableContent._parts[p];
      var partElt = {
        type: 'gridTableHeader',
        children: [],
        data: {
          hName: hasHeader && p === 0 ? 'thead' : 'tbody'
        }
      };
      for (var r = 0; r < part._rows.length; ++r) {
        var row = part._rows[r];
        var rowElt = {
          type: 'gridTableRow',
          children: [],
          data: {
            hName: 'tr'
          }
        };
        for (var c = 0; c < row._cells.length; ++c) {
          var cell = row._cells[c];
          var cellElt = {
            type: 'gridTableCell',
            children: tokenizer.tokenizeBlock(cell._lines.map(function (e) {
              return e.trim();
            }).join('\n'), now),
            data: {
              hName: hasHeader && p === 0 ? 'th' : 'td',
              hProperties: {
                colspan: cell._colspan,
                rowspan: cell._rowspan
              }
            }
          };

          var endLine = r + cell._rowspan;
          if (cell._rowspan > 1 && endLine - 1 < part._rows.length) {
            for (var rs = 1; rs < cell._rowspan; ++rs) {
              for (var cc = 0; cc < part._rows[r + rs]._cells.length; ++cc) {
                var other = part._rows[r + rs]._cells[cc];
                if (cell._startPosition === other._startPosition && cell._endPosition === other._endPosition && cell._colspan === other._colspan && cell._rowspan === other._rowspan && cell._lines === other._lines) {
                  part._rows[r + rs]._cells.splice(cc, 1);
                }
              }
            }
          }

          rowElt.children.push(cellElt);
        }
        partElt.children.push(rowElt);
      }
      tableElt.children.push(partElt);
    }

    tableWrapper.children.push(tableElt);

    return tableWrapper;
  }

  function gridTableTokenizer(eat, value, silent) {
    var keep = mainLineRegex.exec(value);
    if (!keep) return;

    var _extractTable = extractTable(value, eat, this),
        _extractTable2 = _slicedToArray(_extractTable, 4),
        before = _extractTable2[0],
        gridTable = _extractTable2[1],
        after = _extractTable2[2],
        hasHeader = _extractTable2[3];

    if (!gridTable || gridTable.length < 3) return;

    var now = eat.now();

    var linesInfos = computeColumnStartingPositions(gridTable);

    var tableContent = extractTableContent(gridTable, linesInfos, hasHeader);
    var tableElt = generateTable(tableContent, now, this);
    var merged = merge(before, gridTable, after);

    var wrapperBlock = {
      type: 'element',
      tagName: 'WrapperBlock',
      children: []
    };
    if (before.length > 0) {
      wrapperBlock.children.push(this.tokenizeBlock(before.join('\n'), now)[0]);
    }
    wrapperBlock.children.push(tableElt);
    if (after.length > 0) {
      wrapperBlock.children.push(this.tokenizeBlock(after.join('\n'), now)[0]);
    }
    return eat(merged)(wrapperBlock);
  }

  var Parser = this.Parser;

  // Inject blockTokenizer
  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.grid_table = gridTableTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode'), 0, 'grid_table');

  function transformer(tree) {
    visit(tree, deleteWrapperBlock());
  }

  function deleteWrapperBlock() {
    function one(node, index, parent) {
      if (!node.children) return;

      // If a text node is present in child nodes, check if an abbreviation is present
      var newChildren = [];
      var replace = false;
      for (var c = 0; c < node.children.length; ++c) {
        var child = node.children[c];
        if (child.tagName === 'WrapperBlock' && child.type === 'element') {
          replace = true;
          for (var cc = 0; cc < child.children.length; ++cc) {
            newChildren.push(child.children[cc]);
          }
        } else {
          newChildren.push(child);
        }
      }
      if (replace) {
        node.children = newChildren;
      }
    }
    return one;
  }

  return transformer;

  // TODO
  // 1. comment and readme
  // 2. tests
};