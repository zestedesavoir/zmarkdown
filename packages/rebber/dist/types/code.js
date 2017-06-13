'use strict';

/* Expose. */
var all = require('../all');
module.exports = code;

var defaultMacro = function defaultMacro(innerText, lang) {
  return '\\begin{codeBlock}{' + lang + '} \'\n' + innerText + '\n\\end{codeBlock}\n\n';
};

/* Stringify a Blockquote `node`. */
function code(ctx, node) {
  var macro = ctx.code || defaultMacro;
  var innerText = all(ctx, node);
  return macro(innerText.trim(), node.lang);
}