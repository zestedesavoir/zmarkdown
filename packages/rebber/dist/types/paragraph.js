'use strict';

/* Expose. */
module.exports = paragraph;

/* Stringify a paragraph `node`.
 */
function paragraph(ctx, node) {
  var contents = require('../all')(ctx, node);
  return contents.trim() + '\n\n';
}