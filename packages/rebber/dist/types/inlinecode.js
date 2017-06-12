'use strict';

/* Expose. */
module.exports = inlineCode;

var escape = require('../escaper');

function inlineCode(ctx, node) {
  var finalCode = escape(node.value);
  return '\\texttt{' + finalCode + '}';
}