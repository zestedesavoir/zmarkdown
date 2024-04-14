"use strict";

module.exports = plugin;

/*
LaTeX requires special handlings of footnotes placed in headings such as \section{}
We therefore mark each footnote placed in heading for later handling.
*/

const nodeTypes = ['footnote', 'footnoteDefinition', 'footnoteReference'];
function plugin() {
  return function footnoteProtect(node, index, parent) {
    if (nodeTypes.includes(node.type) && node.commandProtect !== true) {
      node.commandProtect = true;
    }
    if (node.children) {
      node.children.forEach((n, i) => footnoteProtect(n, i, node));
    }
  };
}