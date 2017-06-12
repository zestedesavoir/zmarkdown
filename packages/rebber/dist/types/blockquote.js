'use strict';

/* Expose. */
var all = require('../all');
module.exports = blockquote;

var defaultMacro = function defaultMacro(innerText) {
  return '\\begin{Quotation}\n' + innerText + '\n\\end{Quotation}\n\n';
};

/* Stringify a Blockquote `node`. */
function blockquote(ctx, node) {
  var macro = ctx.blockquote || defaultMacro;
  var innerText = all(ctx, node);
  return macro(innerText.trim());
}