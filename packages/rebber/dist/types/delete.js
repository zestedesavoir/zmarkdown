"use strict";

// TODO: make it customizable

/* Expose. */
module.exports = deleteNode;
/* Stringify a delete `node`. */

function deleteNode(ctx, node, index, parent) {
  var contents = require('../all')(ctx, node);

  return "\\sout{".concat(contents, "}");
}