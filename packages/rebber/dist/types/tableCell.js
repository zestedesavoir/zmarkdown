"use strict";

/* Expose. */
module.exports = tableCell;

var defaultMacro = function defaultMacro(ctx, node) {
  return require('../all')(ctx, node);
};
/* Stringify a tableCell `node`. */


function tableCell(ctx, node) {
  var macro = ctx.tableCell || defaultMacro;
  return macro(ctx, node);
}