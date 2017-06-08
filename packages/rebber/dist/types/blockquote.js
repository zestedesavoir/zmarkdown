'use strict';

/* Expose. */
var all = require('../all');
module.exports = blockquote;

/* Stringify a comment `node`. */
function blockquote(ctx, node) {
  var source = node.author || 'Anonymous';
  var innerText = all(ctx, node);
  return '\\begin{Quotation}{' + source + '}\n' + innerText.trim() + '\n\\end{Quotation}\n\n';
}