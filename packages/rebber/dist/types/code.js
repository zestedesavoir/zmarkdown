"use strict";

/* Expose. */
module.exports = code;

var defaultMacro = function defaultMacro(content, lang) {
  // Default language is "text"
  if (!lang) lang = 'text';
  return "\\begin{CodeBlock}{".concat(lang, "}\n").concat(content, "\n\\end{CodeBlock}\n\n");
};
/* Stringify a code `node`. */


function code(ctx, node) {
  var macro = ctx.code || defaultMacro;
  return "".concat(macro(node.value, node.lang, node.meta));
}

code.macro = defaultMacro;