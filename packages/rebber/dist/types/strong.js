'use strict';

/* Dependencies. */
var all = require('../all');

/* Expose. */
module.exports = strong;

/* Stringify a strong `node`. */
function strong(ctx, node, index, parent) {
  var contents = all(ctx, node);

  return '\\textbf{' + contents + '}';
}