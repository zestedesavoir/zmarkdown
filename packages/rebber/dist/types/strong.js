"use strict";

// TODO: make it customizable

/* Expose. */
module.exports = strong;
/* Stringify a strong `node`. */

function strong(ctx, node, index, parent) {
  var contents = require('../all')(ctx, node);

  return "\\textbf{".concat(contents, "}");
}