'use strict';

var baseCell = require('../types/tableCell');
var baseTable = require('../types/table');
var clone = require('clone');

module.exports = gridTable;

function overridenTableCell(ctx, node) {
  var overridenCtx = clone(ctx);
  overridenCtx.tableCell = undefined;
  var baseText = baseCell(overridenCtx, node).trim().replace(/\n/g, ' \\par ');
  if (node.data.hProperties.rowspan > 1) {
    baseText = '\\multirow{' + node.data.hProperties.rowspan + '}{*}{' + baseText + '}';
  } else if (node.data.hProperties.colspan > 1) {
    baseText = '\\multicolumn{' + node.data.hProperties.colspan + '}{|c|}{' + baseText + '}';
  }
  return baseText;
}

function overridenHeaderParse(rows) {
  var lengths = rows.map(function (l) {
    return l.split('&').length;
  });
  var cols = lengths.sort()[0];
  var headers = ('|p{\\linewidth / ' + cols + '}').repeat(cols);
  return headers + '|';
}

function gridTable(ctx, node) {
  var overridenCtx = clone(ctx);
  overridenCtx.break = function () {
    return ' \\par';
  }; // in gridtables '\\\\' won't work
  overridenCtx.tableCell = overridenTableCell;
  overridenCtx.headerParse = overridenHeaderParse;
  return baseTable(overridenCtx, node);
}