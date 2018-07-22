'use strict';

var visit = require('unist-util-visit');

function plugin() {
  var postfix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '-postfix';

  return function (tree) {
    visit(tree, 'element', function (node, index, parent) {
      if (!['li', 'sup'].includes(node.tagName)) return;
      if (node.tagName === 'li') {
        if (!node.properties || !node.properties.id) return;
        if (!node.properties.id.startsWith('fn-')) return;
        if (!node.children.length || node.children[node.children.length - 2].tagName !== 'a') return;

        if (typeof postfix === 'function') {
          var id = node.properties.id;
          node.properties.id = postfix(id);
          var link = node.children[node.children.length - 2].properties.href;
          node.children[node.children.length - 2].properties.href = '#' + postfix(link.substr(1));
        } else {
          node.properties.id += postfix;
          node.children[node.children.length - 2].properties.href += postfix;
        }
      }

      if (node.tagName === 'sup') {
        if (!node.properties || !node.properties.id) return;
        if (!node.properties.id.startsWith('fnref-')) return;
        if (!node.children.length || node.children[0].tagName !== 'a') return;

        if (typeof postfix === 'function') {
          var _id = node.properties.id;
          node.properties.id = postfix(_id);
          var _link = node.children[0].properties.href;
          node.children[0].properties.href = '#' + postfix(_link.substr(1));
        } else {
          node.properties.id += postfix;
          node.children[0].properties.href += postfix;
        }
      }
    });
  };
}

module.exports = plugin;