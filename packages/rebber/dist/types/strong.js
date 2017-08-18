'use strict';

/* Expose. */
module.exports = strong;

/* Stringify a strong `node`. */
function strong(ctx, node, index, parent) {
  var contents = require('../all')(ctx, node);

  return '\\textbf{' + contents + '}';
}