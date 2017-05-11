'use strict';

var visit = require('unist-util-visit');

function plugin() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  function transformer(tree) {
    visit(tree, 'element', visitor);
  }

  function visitor(node, index, parent) {
    if (node.tagName === 'a' && node.properties.className && node.properties.className.includes('footnote-backref')) {
      var identifier = parent.properties.id.slice(3);
      var placeholderIndex = title.indexOf('$id');
      var thisTitle = void 0;
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