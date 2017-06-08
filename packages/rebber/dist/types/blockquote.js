'use strict';

/* Expose. */
var all = require('../all');
module.exports = blockquote;

/* Stringify a comment `node`. */
function blockquote(ctx, node) {
  var macro = 'Quotation';
  var useSource = false;
  if (ctx && ctx.blockquote) {
    if (ctx.blockquote.macro) macro = ctx.blockquote.macro;
    if (ctx.blockquote.useSource === true) useSource = true;
  }
  var source = '{' + (node.author || 'Anonymous') + '}';
  var innerText = all(ctx, node);
  return '\\begin{' + macro + '}' + (useSource ? source : '') + '\n' + innerText.trim() + '\n\\end{' + macro + '}\n\n';
}