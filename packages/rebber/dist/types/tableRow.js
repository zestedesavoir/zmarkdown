'use strict';

/* Expose. */
var one = require('../one');
module.exports = tableRow;

var defaultMacro = function defaultMacro(ctx, node) {
  var parsed = [];
  node.children.map(function (n, index) {
    return parsed.push(one(ctx, n, index, node));
  });
  var line = parsed.join(' & ');
  return line + ' \\\\ \\hline\n';
};

/* Stringify a tableRow `node`. */
function tableRow(ctx, node) {
  var macro = ctx.tableRow || defaultMacro;
  return macro(ctx, node);
}