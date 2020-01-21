"use strict";

var collapse = require('collapse-white-space');

var escape = require('../escaper');

module.exports = function inlineCode(ctx, node) {
  var finalCode = escape(collapse(node.value));
  return "\\texttt{".concat(finalCode, "}");
};