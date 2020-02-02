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

function setPostfix(node, aTag, postfix) {
  if (typeof postfix === 'function') {
    var id = node.properties.id;
    node.properties.id = postfix(id);
    var link = aTag.properties.href;
    aTag.properties.href = "#".concat(postfix(link.substr(1)));
  } else {
    node.properties.id += postfix;
    aTag.properties.href += postfix;
  }
}

function plugin() {
  var postfix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '-postfix';
  return function (tree) {
    visit(tree, 'element', function (node, index, parent) {
      if (!['li', 'sup'].includes(node.tagName)) return;

      if (node.tagName === 'li') {
        if (!node.properties || !node.properties.id) return;
        if (!node.properties.id.startsWith('fn-')) return;
        if (!node.children.length) return;
        var aTag = findLastLink(node, 'footnote-backref');

        if (!aTag) {
          var pTag = findLastTag(node, 'p');
          aTag = findLastLink(pTag, 'footnote-backref');
        }

        if (!aTag) return;
        setPostfix(node, aTag, postfix);
      }

      if (node.tagName === 'sup') {
        if (!node.properties || !node.properties.id) return;
        if (!node.properties.id.startsWith('fnref-')) return;
        if (!node.children.length || node.children[0].tagName !== 'a') return;
        var _aTag = node.children[0];
        if (!_aTag.properties || !_aTag.properties.className || !_aTag.properties.className.includes('footnote-ref')) return;
        setPostfix(node, _aTag, postfix);
      }
    });
  };
}

module.exports = plugin;