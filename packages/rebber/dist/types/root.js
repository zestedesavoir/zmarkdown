'use strict';

/* Dependencies. */
var one = require('../one');

/* Expose. */
module.exports = root;

/* Stringify a text `node`. */
function root(ctx, node, _, parent) {
  var values = [];
  var children = node.children;
  var length = children.length;
  var index = -1;
  var child = void 0;
  var prev = void 0;

  while (++index < length) {
    child = children[index];

    if (prev) {
      if (child.type === prev.type && prev.type === 'list') {
        values.push(prev.ordered === child.ordered ? '\n\n\n' : '\n\n');
      } else if (prev.type === 'list' && child.type === 'code' && !child.lang) {
        values.push('\n\n\n');
      } else {
        values.push('\n\n');
      }
    }

    values.push(one(ctx, child, index, node, node));

    prev = child;
  }

  return values.join('');
}