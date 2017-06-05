'use strict';

/* Dependencies. */
var all = require('../all');

/* Expose. */
module.exports = deleteNode;

/* Stringify a delete `node`. */
function deleteNode(ctx, node, index, parent) {
  var contents = all(ctx, node);

  return '\\sout{' + contents + '}';
}