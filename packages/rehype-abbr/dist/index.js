'use strict';

var visit = require('unist-util-visit');

function plugin() {
  function transformer(tree) {
    var abbrs = {};
    visit(tree, 'element', find(abbrs));
    visit(tree, replace(abbrs));
  }

  function find(abbrs) {
    function one(node, index, parent) {
      if (node.tagName === 'p') {
        for (var i = 0; i < node.children.length; ++i) {
          var child = node.children[i];
          console.log(child);
          if (child.tagName === 'abbr') {
            // Store abbreviation
            abbrs[child.properties.word] = child.properties.desc;
            node.children.splice(i, 1);
            i -= 1;
          }
        }
        // Remove paragraph if there is no child
        if (node.children.length === 0) parent.children.splice(index, 1);
      }
    }
    return one;
  }

  function replace(abbrs) {
    function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' // eslint-disable-line no-useless-escape
      );
    }

    var pattern = Object.keys(abbrs).map(escapeRegExp).join('|');
    var regex = new RegExp('\\b(' + pattern + ')\\b');

    function one(node, index, parent) {
      if (Object.keys(abbrs).length === 0) return;
      if (!node.children) return;

      // If a text node is present in child nodes, check if an abbreviation is present
      for (var c = 0; c < node.children.length; ++c) {
        var child = node.children[c];
        if (node.tagName !== 'abbr' && child.type === 'text') {
          var keep = regex.exec(child.value);
          if (keep) {
            // Transform node
            var newTexts = child.value.split(regex
            // Remove old text node
            );node.children.splice(c, 1
            // Replace abbreviations
            );for (var i = 0; i < newTexts.length; ++i) {
              var content = newTexts[i];
              if (abbrs.hasOwnProperty(content)) {
                node.children.splice(c + i, 0, {
                  type: 'element',
                  tagName: 'abbr',
                  properties: { title: abbrs[content] },
                  children: [{ type: 'text', value: content }]
                });
              } else {
                node.children.splice(c + i, 0, {
                  type: 'text',
                  value: content
                });
              }
            }
          }
        }
      }
    }
    return one;
  }

  return transformer;
}

module.exports = plugin;