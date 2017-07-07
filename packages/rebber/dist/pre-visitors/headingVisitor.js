'use strict';

module.exports = plugin;

function plugin() {
  var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function headingVisitor(node, index, parent) {
    if (node.type === 'footnote' && node.inHeading !== true) annotate(node);

    if (node.children) {
      node.children.map(function (n, i) {
        return headingVisitor(n, i, node);
      });
    }
  };
}

function annotate(node) {
  node.inHeading = true;
}