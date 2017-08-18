'use strict';

/* Expose. */
module.exports = emphasis;

/* Stringify an emphasis `node`. */
function emphasis(ctx, node, index, parent) {
  var contents = require('../all')(ctx, node);

  return '\\textit{' + contents + '}';
}