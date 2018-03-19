'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var one = require('../one');

/* Expose. */
module.exports = table;

var defaultHeaderParse = function defaultHeaderParse(rows) {
  var columns = Math.max.apply(Math, _toConsumableArray(rows.map(function (l) {
    return l.split('&').length;
  })));
  var colHeader = '|' + 'c|'.repeat(columns);
  return colHeader;
};

var defaultMacro = function defaultMacro(ctx, node) {
  var headerParse = ctx.headerParse ? ctx.headerParse : defaultHeaderParse;
  var parsed = node.children.map(function (n, index) {
    return one(ctx, n, index, node);
  });
  var inner = parsed.join('');
  var colHeader = headerParse(parsed);
  var addendum = node.caption ? '\n\\tableCaption{' + node.caption + '}\n' : '';
  return '\\begin{longtabu}{' + colHeader + '} \\hline\n' + inner + addendum + '\\end{longtabu}\n\n';
};

/* Stringify a table `node`. */
function table(ctx, node) {
  var macro = ctx.table || defaultMacro;
  return macro(ctx, node);
}