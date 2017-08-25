'use strict';

/* Dependencies. */
var baseCell = require('rebber/dist/types/tableCell');
var baseTable = require('rebber/dist/types/table');
var clone = require('clone');

/* Expose. */
module.exports = gridTable;

function overriddenTableCell(ctx, node) {
  var overriddenCtx = clone(ctx);
  overriddenCtx.tableCell = undefined;
  var baseText = baseCell(overriddenCtx, node).trim().replace(/\n/g, ' \\par ');
  if (node.data.hProperties.rowspan > 1) {
    baseText = '\\multirow{' + node.data.hProperties.rowspan + '}{*}{' + baseText + '}';
  } else if (node.data.hProperties.colspan > 1) {
    baseText = '\\multicolumn{' + node.data.hProperties.colspan + '}{|c|}{' + baseText + '}';
  }
  return baseText;
}

function overriddenHeaderParse(rows) {
  var lengths = rows.map(function (l) {
    return l.split('&').length;
  });
  var cols = lengths.sort()[0];
  var headers = ('|p{\\linewidth / ' + cols + '}').repeat(cols);
  return headers + '|';
}

function gridTable(ctx, node) {
  var overriddenCtx = clone(ctx);
  overriddenCtx.break = function () {
    return ' \\par';
  }; // in gridtables '\\\\' won't work
  overriddenCtx.tableCell = overriddenTableCell;
  overriddenCtx.headerParse = overriddenHeaderParse;
  return baseTable(overriddenCtx, node);
}