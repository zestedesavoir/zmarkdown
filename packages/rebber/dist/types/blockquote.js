"use strict";

/* Expose. */
module.exports = blockquote;

var defaultMacro = function defaultMacro(innerText) {
  return "\\begin{Quotation}\n".concat(innerText, "\n\\end{Quotation}\n\n");
};
/* Stringify a Blockquote `node`. */


function blockquote(ctx, node) {
  var macro = ctx.blockquote || defaultMacro;

  var innerText = require('../all')(ctx, node);

  return macro(innerText.trim());
}