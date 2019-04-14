"use strict";

/* Expose. */
module.exports = paragraph;
/* Stringify a paragraph `node`.
 */

function paragraph(ctx, node) {
  var contents = require('../all')(ctx, node);

  return "".concat(contents.trim(), "\n\n");
}