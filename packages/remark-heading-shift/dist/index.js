'use strict';

var visit = require('unist-util-visit');

function shifter() {
  var shift = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  return function (tree) {
    visit(tree, 'heading', function (node) {
      if (!shift) return;
      if (node.depth + shift <= 1) {
        node.depth = 1;
        return;
      }
      if (node.depth + shift >= 6) {
        node.depth = 6;
        return;
      }
      node.depth += shift;
    });
  };
}

module.exports = shifter;