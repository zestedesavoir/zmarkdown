"use strict";

module.exports = plugin;
/*
LaTeX requires special handlings of footnotes placed in headings such as \section{}
We therefore mark each footnote placed in heading for later handling.
*/

var nodeTypes = ['footnote', 'footnoteDefinition', 'footnoteReference'];

function plugin() {
  return function headingVisitor(node, index, parent) {
    if (nodeTypes.includes(node.type) && node.inHeading !== true) {
      node.inHeading = true;
    }

    if (node.children) {
      node.children.forEach(function (n, i) {
        return headingVisitor(n, i, node);
      });
    }
  };
}