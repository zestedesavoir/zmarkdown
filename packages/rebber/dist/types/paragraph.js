'use strict';

var all = require('../all');

/* Expose. */
module.exports = paragraph;

/* Stringify a paragraph `node`.
 */
function paragraph(ctx, node) {
  var contents = all(ctx, node);
  return contents + '\n\n';
}