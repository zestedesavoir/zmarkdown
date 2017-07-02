'use strict';

/* Dependencies. */
var one = require('./one');

/* Expose. */
module.exports = all;

/* Stringify all children of `parent`. */
function all(ctx, parent) {
  var children = parent && parent.children;
  var length = children && children.length;
  var index = -1;
  var results = [];

  while (++index < length) {
    results[index] = one(ctx, children[index], index, parent);
  }

  return results.join('');
}