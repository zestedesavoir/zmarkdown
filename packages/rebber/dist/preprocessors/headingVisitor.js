'use strict';

module.exports = plugin;

/*
LaTeX requires special handlings of footnotes placed in headings such as \section{}
We therefore mark each footnote placed in handing for later handling.
*/

function plugin() {
  return function headingVisitor(node, index, parent) {
    if (node.type === 'footnote' && node.inHeading !== true) mark(node);

    if (node.children) {
      node.children.map(function (n, i) {
        return headingVisitor(n, i, node);
      });
    }
  };
}

function mark(node) {
  node.inHeading = true;
}