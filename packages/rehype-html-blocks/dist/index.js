'use strict';

var visit = require('unist-util-visit');

var inline = ['a', 'b', 'big', 'i', 'small', 'tt', 'abbr', 'acronym', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'time', 'var', 'bdo', 'br', 'img', 'map', 'object', 'p', 'q', 'script', 'span', 'sub', 'sup', 'button', 'input', 'label', 'select', 'textarea'];

function plugin() {
  return transformer;
}

function transformer(tree) {
  visit(tree, 'raw', visitor);
}

function visitor(node, index, parent) {
  var replacement = void 0;
  if (!parent) return;

  if (!inline.includes(parent.tagName)) {
    replacement = {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{
        type: 'text',
        value: node.value
      }]
    };
  } else {
    replacement = {
      type: 'text',
      value: node.value
    };
  }

  parent.children[index] = replacement;
}

module.exports = plugin;