"use strict";

/* Expose. */
var one = require('../one');

module.exports = tableRow;

var defaultMacro = function defaultMacro(ctx, node) {
  var parsed = [];
  node.children.map(function (n, index) {
    return parsed.push(one(ctx, n, index, node));
  });
  var line = parsed.join(' & ');
  return "".concat(line, " \\\\ \\hline\n");
};

var defaultFirstLineRowFont = '\\rowfont[c]{\\bfseries}';
var defaultOtherLineRowFont = '\\rowfont[l]{}';
/* Stringify a tableRow `node`. */

function tableRow(ctx, node, index) {
  var macro = ctx.tableRow || defaultMacro;
  var firstLineRowFont = ctx.firstLineRowFont || defaultFirstLineRowFont;
  var otherLineRowFont = ctx.otherLineRowFont || defaultOtherLineRowFont;

  if (index === 0) {
    return "".concat(firstLineRowFont, "\n").concat(macro(ctx, node));
  } else if (index === 1) {
    return "".concat(otherLineRowFont, "\n").concat(macro(ctx, node));
  } else {
    return macro(ctx, node);
  }
}