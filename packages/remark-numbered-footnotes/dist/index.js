'use strict';

var visit = require('unist-util-visit');

var footnotes = {};

function plugin() {
  return transformer;
}

function transformer(tree) {
  footnotes = {};
  visit(tree, 'footnote', normalize);
  visit(tree, 'footnoteDefinition', normalize);

  visit(tree, 'normalizedfootnote', visitor);

  visit(tree, 'normalizedfootnote', denormalize);

  visit(tree, 'footnoteReference', visitor);
}

function normalize(node, index, parent) {
  node.originalType = node.type;
  node.type = 'normalizedfootnote';
}

function denormalize(node, index, parent) {
  node.type = node.originalType;
  node.originalType = null;
}

function visitor(node, index, parent) {
  var identifier = node.identifier || JSON.stringify(node.position.start);
  if (!footnotes.hasOwnProperty(identifier)) {
    footnotes[identifier] = Object.keys(footnotes).length + 1;
  }
  node.identifier = footnotes[identifier];
}

module.exports = plugin;