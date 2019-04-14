"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var one = require('../one');
/* Expose. */


module.exports = table;

var defaultHeaderParse = function defaultHeaderParse(rows) {
  var columns = Math.max.apply(Math, _toConsumableArray(rows.map(function (l) {
    return l.split('&').length;
  })));
  var colHeader = "|".concat('X[-1]|'.repeat(columns));
  return colHeader;
};

var defaultMacro = function defaultMacro(ctx, node) {
  var headerParse = ctx.headerParse ? ctx.headerParse : defaultHeaderParse;
  var parsed = node.children.map(function (n, index) {
    return one(ctx, n, index, node);
  });
  var inner = parsed.join('');
  var colHeader = headerParse(parsed);
  var spreadCell = typeof ctx.spreadCell === 'string' ? ctx.spreadCell : ' spread 0pt ';
  var caption = node.caption ? "\n\\captionof{table}{".concat(node.caption, "}\n") : '';
  return "\\begin{longtabu}".concat(spreadCell, "{").concat(colHeader, "} \\hline\n").concat(inner, "\\end{longtabu}").concat(caption, "\n");
};
/* Stringify a table `node`. */


function table(ctx, node) {
  var macro = ctx.table || defaultMacro;
  return macro(ctx, node);
}