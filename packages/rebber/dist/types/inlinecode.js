'use strict';

// TODO: make it customizable
/* Expose. */
module.exports = inlineCode;

var escape = require('../escaper');

function inlineCode(ctx, node) {
  var finalCode = escape(node.value);
  return '\\texttt{' + finalCode + '}';
}