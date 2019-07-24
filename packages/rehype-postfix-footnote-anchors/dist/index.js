"use strict";

var visit = require('unist-util-visit');

function plugin() {
  var postfix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '-postfix';
  return function (tree) {
    visit(tree, 'element', function (node, index, parent) {
      if (!['li', 'sup'].includes(node.tagName)) return;

      if (node.tagName === 'li') {
        if (!node.properties || !node.properties.id) return;
        if (!node.properties.id.startsWith('fn-')) return;
        var aTag;
        if (!node.children.length) return;

        if (node.children[node.children.length - 1].tagName === 'a') {
          aTag = node.children[node.children.length - 1];
        } else if (node.children[node.children.length - 2].tagName === 'p') {
          var pTag = node.children[node.children.length - 2];
          if (pTag.children[pTag.children.length - 1].tagName !== 'a') return;
          aTag = pTag.children[pTag.children.length - 1];
        } else return;

        if (!aTag.properties || !aTag.properties.className || !aTag.properties.className.includes('footnote-backref')) return;

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

      if (node.tagName === 'sup') {
        if (!node.properties || !node.properties.id) return;
        if (!node.properties.id.startsWith('fnref-')) return;
        if (!node.children.length || node.children[0].tagName !== 'a') return;
        var _aTag = node.children[0];
        if (!_aTag.properties || !_aTag.properties.className || !_aTag.properties.className.includes('footnote-ref')) return;

        if (typeof postfix === 'function') {
          var _id = node.properties.id;
          node.properties.id = postfix(_id);
          var _link = _aTag.properties.href;
          _aTag.properties.href = "#".concat(postfix(_link.substr(1)));
        } else {
          node.properties.id += postfix;
          _aTag.properties.href += postfix;
        }
      }
    });
  };
}

module.exports = plugin;