"use strict";

/* Expose. */
module.exports = comment;

/* Stringify a comment `node`. */
function comment(ctx, node) {
  return "\\begin{comment}\n" + node.value + "\n\\end{comment}";
}