"use strict";

/* Dependencies. */
var trimLines = require('trim-lines');

var escaper = require('../escaper');
/* Stringify a text `node`. */


module.exports = function text(ctx, node, index, parent) {
  var value = trimLines(node.value);
  return isLiteral(parent) ? value : escaper(value, ctx.escapes);
}; // TODO: `tagName` isn't part of MDAST!

/* Check if content of `node` should not be escaped. */


function isLiteral(node) {
  return node && (node.tagName === 'script' || node.tagName === 'style');
}