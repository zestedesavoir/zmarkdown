'use strict';

/* Dependencies. */
var all = require('rebber/dist/all');

/* Expose. */
module.exports = sub;

/* Stringify a sub `node`. */
function sub(ctx, node, index, parent) {
  var contents = all(ctx, node);

  return '\\textsubscript{' + contents + '}';
}