'use strict';

/* Expose. */
var all = require('../all');
module.exports = tableCell;

var defaultMacro = function defaultMacro(ctx, node) {
  return all(ctx, node);
};

/* Stringify a tableCell `node`. */
function tableCell(ctx, node) {
  var macro = ctx.tableCell || defaultMacro;
  return macro(ctx, node);
}