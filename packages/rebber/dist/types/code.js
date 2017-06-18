"use strict";

/* Expose. */
module.exports = code;

var defaultMacro = function defaultMacro(content, lang) {
  return "\\begin{codeBlock}{" + lang + "}\n" + content + "\n\\end{codeBlock}\n\n";
};

/* Stringify a Blockquote `node`. */
function code(ctx, node) {
  var macro = ctx.code || defaultMacro;
  return macro(node.value, node.lang);
}