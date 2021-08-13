"use strict";

/* Expose. */
module.exports = code;

var defaultMacro = function defaultMacro(content, lang) {
  // Escape CodeBlocks
  var escaped = content.replace(new RegExp('\\\\end\\s*{CodeBlock}', 'g'), ''); // Default language is "text"

  if (!lang) lang = 'text';
  return "\\begin{CodeBlock}{".concat(lang, "}\n").concat(escaped, "\n\\end{CodeBlock}\n\n");
};
/* Stringify a code `node`. */


function code(ctx, node) {
  var macro = ctx.code || defaultMacro;
  return "".concat(macro(node.value, node.lang, node.meta));
}

code.macro = defaultMacro;