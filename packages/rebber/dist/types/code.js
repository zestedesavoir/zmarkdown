"use strict";

/* Expose. */
module.exports = code;

var defaultMacro = function defaultMacro(content, lang) {
  // Escape CodeBlocks
  var escaped = content;
  var escapeRegex = new RegExp('\\\\end\\s*{CodeBlock}', 'g');

  while (escapeRegex.test(escaped)) {
    escaped = escaped.replace(escapeRegex, '');
  } // Default language is "text"


  if (!lang) lang = 'text';
  return "\\begin{CodeBlock}{".concat(lang, "}\n").concat(escaped, "\n\\end{CodeBlock}\n\n");
};
/* Stringify a code `node`. */


function code(ctx, node) {
  var macro = ctx.code || defaultMacro;
  return "".concat(macro(node.value, node.lang, node.meta));
}

code.macro = defaultMacro;