"use strict";

var visit = require('unist-util-visit-parents');

function plugin() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  function transformer(tree) {
    visit(tree, 'element', visitor);
  }

  function visitor(node, parents) {
    if (node.tagName === 'a' && node.properties.className && node.properties.className.includes('footnote-backref') && parents.length > 2 && parents[parents.length - 2].tagName === 'li') {
      var parent = parents[parents.length - 2];
      var identifier = parent.properties.id.slice(3);
      var placeholderIndex = title.indexOf('$id');
      var thisTitle;

      if (placeholderIndex !== -1) {
        thisTitle = title.split('');
        thisTitle.splice(placeholderIndex, 3, identifier);
        thisTitle = thisTitle.join('');
      }

      if (!thisTitle) thisTitle = identifier;
      node.properties.title = thisTitle;
    }
  }

  return transformer;
}

module.exports = plugin;