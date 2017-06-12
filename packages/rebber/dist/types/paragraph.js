'use strict';

/* Dependencies. */
var all = require('../all'

/* Expose. */
);module.exports = paragraph;

/* Stringify a paragraph `node`.
 */
function paragraph(ctx, node) {
  var contents = all(ctx, node);
  return contents.trim() + '\n\n';
}