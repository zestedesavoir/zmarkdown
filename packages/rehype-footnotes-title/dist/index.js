"use strict";

var visit = require('unist-util-visit');

function findLastTag(node) {
  var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'p';
  if (!node.children || !node.children.length) return;
  var links = node.children.filter(function (e) {
    return e.tagName === tag;
  });
  if (!links.length) return;
  return links[links.length - 1];
}

function findLastLink(node, className) {
  if (!node.children || !node.children.length) return;
  var links = node.children.filter(function (e) {
    return e.tagName === 'a';
  });
  if (!links.length) return;
  var aTag = links[links.length - 1];
  if (!aTag.properties || !aTag.properties.className || !aTag.properties.className.includes(className)) return;
  return aTag;
}

function plugin() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  function transformer(tree) {
    visit(tree, 'element', visitor);
  }

  function visitor(node, index, parent) {
    if (node.tagName === 'li' && node.properties.id) {
      if (!node.children || !node.children.length) return;
      var aTag = findLastLink(node, 'footnote-backref');

      if (!aTag) {
        var pTag = findLastTag(node, 'p');
        aTag = findLastLink(pTag, 'footnote-backref');
      }

      if (!aTag) return;
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