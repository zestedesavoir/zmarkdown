'use strict';

/* Dependencies. */
var all = require('../all');

/* Expose. */
module.exports = emphasis;

/* Stringify a emphasis `node`. */
function emphasis(ctx, node, index, parent) {
  var contents = all(ctx, node);

  return '\\textit{' + contents + '}';
}