'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var visit = require('unist-util-visit');

function plugin() {
  function locator(value, fromIndex) {
    return value.indexOf('*[', fromIndex);
  }

  function inlineTokenizer(eat, value, silent) {
    var regex = new RegExp(/[*]\[([^\]]*)\]:\s*(.+)\n*/);
    var keep = regex.exec(value);

    /* istanbul ignore if - never used (yet) */
    if (silent) return silent;
    if (!keep || keep.index !== 0) return;

    var _keep = _slicedToArray(keep, 3),
        matched = _keep[0],
        abbr = _keep[1],
        reference = _keep[2];

    return eat(matched)({
      type: 'abbr',
      abbr: abbr,
      reference: reference,
      children: [{ type: 'text', value: abbr }],
      data: {
        hName: 'abbr',
        hProperties: {
          title: reference
        }
      }
    });
  }

  function transformer(tree) {
    var abbrs = {};
    visit(tree, 'paragraph', find(abbrs));
    visit(tree, replace(abbrs));
  }

  function find(abbrs) {
    return function one(node, index, parent) {
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (child.type !== 'abbr') continue;
        // Store abbr node for later use
        abbrs[child.abbr] = child;
        node.children.splice(i, 1);
        i -= 1;
      }
      // Remove paragraph if there is no child
      if (node.children.length === 0) parent.children.splice(index, 1);
    };
  }

  function replace(abbrs) {
    function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
    }

    var pattern = Object.keys(abbrs).map(escapeRegExp).join('|');
    var regex = new RegExp('\\b(' + pattern + ')\\b');

    function one(node, index, parent) {
      if (Object.keys(abbrs).length === 0) return;
      if (!node.children) return;

      // If a text node is present in child nodes, check if an abbreviation is present
      for (var c = 0; c < node.children.length; c++) {
        var child = node.children[c];
        if (node.type === 'abbr' || child.type !== 'text') continue;
        if (!regex.test(child.value)) continue;

        // Transform node
        var newTexts = child.value.split(regex);

        // Remove old text node
        node.children.splice(c, 1);

        // Replace abbreviations
        for (var i = 0; i < newTexts.length; i++) {
          var content = newTexts[i];
          if (abbrs.hasOwnProperty(content)) {
            node.children.splice(c + i, 0, abbrs[content]);
          } else {
            node.children.splice(c + i, 0, {
              type: 'text',
              value: content
            });
          }
        }
      }
    }
    return one;
  }

  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.abbr = inlineTokenizer;
  inlineMethods.splice(0, 0, 'abbr');

  return transformer;
}

module.exports = plugin;