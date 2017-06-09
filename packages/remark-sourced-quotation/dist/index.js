'use strict';

var visit = require('unist-util-visit');

var footnotes = {};

function plugin() {
  return transformer;
}

function transformer(tree) {
  visit(tree, 'footnoteDefinition', visitor);
  visit(tree, 'footnoteReference', visitor);
}

function visitor(node, index, parent) {
  if (!footnotes.hasOwnProperty(node.identifier)) {
    footnotes[node.identifier] = Object.keys(footnotes).length + 1;
  }
  node.identifier = footnotes[node.identifier];
}

module.exports = plugin;