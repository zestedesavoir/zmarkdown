'use strict';

/* Dependencies. */
var one = require('./one');

/* Expose. */
module.exports = all;

/* Stringify all children of `parent`. */
function all(ctx, parent) {
  var children = parent && parent.children;

  if (!children) return '';

  return children.map(function (child, index) {
    return one(ctx, child, index, parent);
  }).join('');
}