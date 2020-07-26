"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var clone = require('clone');

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
  var overriddenCtx = clone(ctx);
  overriddenCtx.image = overriddenCtx.image ? overriddenCtx.image : {};

  overriddenCtx.image.inlineMatcher = function () {
    return true;
  };

  return macro(overriddenCtx, node);
}