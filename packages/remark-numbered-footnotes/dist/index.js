'use strict';

var visit = require('unist-util-visit');

function plugin() {
  return transformer;
}

function transformer(tree) {
  var footnotes = {};
  visit(tree, 'footnote', normalize);
  visit(tree, 'footnoteDefinition', normalize);

  visit(tree, 'normalizedfootnote', createIds(footnotes));

  visit(tree, 'normalizedfootnote', denormalize);

  visit(tree, 'footnoteReference', replaceIds(footnotes));
}

function normalize(node, index, parent) {
  node.originalType = node.type;
  node.type = 'normalizedfootnote';
}

function denormalize(node, index, parent) {
  node.type = node.originalType;
  node.originalType = null;
}

function createIds(footnotes) {
  return function (node, index, parent) {
    var identifier = typeof node.identifier === 'undefined' ? autoId(node.position.start) : node.identifier;

    if (!footnotes.hasOwnProperty(identifier)) {
      footnotes[identifier] = Object.keys(footnotes).length + 1;
    }
    node.identifier = footnotes[identifier];
  };
}

function replaceIds(footnotes) {
  return function (node, index, parent) {
    var identifier = typeof node.identifier === 'undefined' ? autoId(node.position.start) : node.identifier;

    if (!footnotes.hasOwnProperty(identifier)) {
      footnotes[identifier] = Object.keys(footnotes).length + 1;
    }
    node.identifier = footnotes[identifier];
  };
}

function autoId(node) {
  var line = node.line,
      column = node.column,
      offset = node.offset;

  return 'l' + line + 'c' + column + 'o' + offset;
}

module.exports = plugin;