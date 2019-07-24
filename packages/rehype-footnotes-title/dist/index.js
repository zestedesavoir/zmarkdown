"use strict";

var visit = require('unist-util-visit');

function plugin() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  function transformer(tree) {
    visit(tree, 'element', visitor);
  }

  function visitor(node, index, parent) {
    if (node.tagName === 'li' && node.properties.id) {
      var aTag;
      if (!node.children || !node.children.length) return;

      if (node.children[node.children.length - 1].tagName === 'a') {
        aTag = node.children[node.children.length - 1];
      } else if (node.children[node.children.length - 2].tagName === 'p') {
        var pTag = node.children[node.children.length - 2];
        if (pTag.children[pTag.children.length - 1].tagName !== 'a') return;
        aTag = pTag.children[pTag.children.length - 1];
      } else return;

      var identifier = node.properties.id.slice(3);
      var placeholderIndex = title.indexOf('$id');
      var thisTitle;

      if (placeholderIndex !== -1) {
        thisTitle = title.split('');
        thisTitle.splice(placeholderIndex, 3, identifier);
        thisTitle = thisTitle.join('');
      }

      if (!thisTitle) thisTitle = identifier;
      aTag.properties.title = thisTitle;
    }
  }

  return transformer;
}

module.exports = plugin;