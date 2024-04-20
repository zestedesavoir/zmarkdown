"use strict";

var visit = require('unist-util-visit');

function plugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$labelPrefix = _ref.labelPrefix,
      labelPrefix = _ref$labelPrefix === void 0 ? '' : _ref$labelPrefix,
      _ref$labelSuffix = _ref.labelSuffix,
      labelSuffix = _ref$labelSuffix === void 0 ? '' : _ref$labelSuffix;

  function transformer(tree) {
    var footnotes = {};
    visit(tree, 'footnote', convert);
    visit(tree, 'footnoteDefinition', createIds(footnotes));
    visit(tree, 'footnoteReference', replaceIds(footnotes));
  }

  function createIds(footnotes) {
    return function (node, index, parent) {
      var identifier = node.identifier;

      if (!footnotes.hasOwnProperty(identifier)) {
        footnotes[identifier] = Object.keys(footnotes).length + 1;
      }

      node.identifier = String(footnotes[identifier]);
      node.label = "".concat(labelPrefix).concat(footnotes[identifier]).concat(labelSuffix);
    };
  }

  function replaceIds(footnotes) {
    return function (node, index, parent) {
      var identifier = node.identifier;

      if (!footnotes.hasOwnProperty(identifier)) {
        footnotes[identifier] = Object.keys(footnotes).length + 1;
      }

      node.identifier = String(footnotes[identifier]);
      node.label = "".concat(labelPrefix).concat(footnotes[identifier]).concat(labelSuffix);
    };
  }

  return transformer;
}

function convert(node, index, parent) {
  var id = autoId(node.position.start);
  var footnoteDefinition = {
    type: 'footnoteDefinition',
    identifier: id,
    children: [{
      type: 'paragraph',
      children: node.children
    }]
  };
  var footnoteReference = {
    type: 'footnoteReference',
    identifier: id
  };
  parent.children.splice(index, 1, footnoteReference, footnoteDefinition);
}

function autoId(node) {
  var line = node.line,
      column = node.column,
      offset = node.offset;
  return "l".concat(line, "c").concat(column, "o").concat(offset);
}

module.exports = plugin;