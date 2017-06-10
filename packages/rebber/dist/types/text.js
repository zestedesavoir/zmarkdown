'use strict';

/* Dependencies. */
var escaper = require('../escaper');

/* Expose. */
module.exports = text;

/* Stringify a text `node`. */
function text(ctx, node, index, parent) {
  var value = node.value;

  return isLiteral(parent) ? value : escaper(value, ctx.escapes);
}

/* Check if content of `node` should not be escaped. */
function isLiteral(node) {
  return node && (node.tagName === 'script' || node.tagName === 'style');
}