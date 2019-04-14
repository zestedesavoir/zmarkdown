"use strict";

/* Expose. */
module.exports = comments;
/* Stringify a comments `node`. */

function comments(ctx, node) {
  return "\\begin{comment}\n".concat(node.data.comment, "\n\\end{comment}\n");
}