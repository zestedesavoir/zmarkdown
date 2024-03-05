"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

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
  return ' X[-1]'.repeat(columns).substring(1);
}; // Retrocompatibility: first row is always header on default tables


var defaultheaderCounter = function defaultheaderCounter() {
  return 1;
};

var defaultMacro = function defaultMacro(ctx, node) {
  var headerParse = ctx.headerParse ? ctx.headerParse : defaultHeaderParse;
  var headerCounter = ctx.headerCounter ? ctx.headerCounter : defaultheaderCounter;
  var parsed = node.children.map(function (n, index) {
    return one(ctx, n, index, node);
  });
  var headerCount = headerCounter(node);
  var colHeader = headerParse(parsed);
  var envName = typeof ctx.tableEnvName === 'string' ? ctx.tableEnvName : 'longtblr';
  var caption = node.caption ? "\n\\captionof{table}{".concat(node.caption, "}\n") : ''; // eslint-disable-next-line max-len

  var headerProperties = typeof ctx.headerProperties === 'string' ? ctx.headerProperties : 'font=\\bfseries';
  var extraProps = '';

  if (headerCount && headerCount > 0) {
    var tableHeaderEnum = new Array(headerCount).fill(0).map(function (_, i) {
      return i + 1;
    }).join(',');
    extraProps += ",rowhead=".concat(headerCount, ",row{").concat(tableHeaderEnum, "}={").concat(headerProperties, "}");
  } // eslint-disable-next-line max-len


  return "\\begin{".concat(envName, "}{colspec={").concat(colHeader, "}").concat(extraProps, "}\n").concat(parsed.join(''), "\\end{").concat(envName, "}").concat(caption, "\n");
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