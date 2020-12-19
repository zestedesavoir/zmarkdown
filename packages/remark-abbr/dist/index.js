"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var visit = require('unist-util-visit');

function plugin(options) {
  var opts = options || {};
  var expandFirst = opts.expandFirst;

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
      children: [{
        type: 'text',
        value: abbr
      }],
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
    var emptyParagraphsToRemove = new Map();
    visit(tree, 'paragraph', find(abbrs, emptyParagraphsToRemove));
    emptyParagraphsToRemove.forEach(function (indices, key) {
      indices.reverse();
      indices.forEach(function (index) {
        key.children.splice(index, 1);
      });
    });
    visit(tree, replace(abbrs));
  }

  function find(abbrs, emptyParagraphsToRemove) {
    return function one(node, index, parent) {
      for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        if (child.type !== 'abbr') continue; // Store abbr node for later use

        abbrs[child.abbr] = child;
        node.children.splice(i, 1);
        i -= 1;
      } // Keep track of empty paragraphs to remove


      if (node.children.length === 0) {
        var indices = emptyParagraphsToRemove.get(parent) || [];
        indices.push(index);
        emptyParagraphsToRemove.set(parent, indices);
      }
    };
  }

  function replace(abbrs) {
    function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
    }

    var pattern = Object.keys(abbrs).map(escapeRegExp).join('|');
    var regex = new RegExp("(\\b|\\W)(".concat(pattern, ")(\\b|\\W)"));
    var expanded = {};

    function one(node, index, parent) {
      if (Object.keys(abbrs).length === 0) return;
      if (!node.children) return; // If a text node is present in child nodes, check if an abbreviation is present

      for (var c = 0; c < node.children.length; c++) {
        var child = node.children[c];
        if (node.type === 'abbr' || child.type !== 'text') continue;
        if (!regex.test(child.value)) continue; // Transform node

        var newTexts = child.value.split(regex); // Remove old text node

        node.children.splice(c, 1); // Replace abbreviations

        for (var i = 0; i < newTexts.length; i++) {
          var content = newTexts[i];

          if (abbrs.hasOwnProperty(content)) {
            var abbr = abbrs[content];

            if (expandFirst && !expanded[content]) {
              node.children.splice(c + i, 0, {
                type: 'text',
                value: "".concat(abbr.reference, " (").concat(abbr.abbr, ")")
              });
              expanded[content] = true;
            } else {
              node.children.splice(c + i, 0, abbr);
            }
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
  var Parser = this.Parser; // Inject inlineTokenizer

  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.abbr = inlineTokenizer;
  inlineMethods.splice(0, 0, 'abbr');
  var Compiler = this.Compiler;

  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    if (!visitors) return;
    var abbrMap = {};

    visitors.abbr = function (node) {
      if (!abbrMap[node.abbr]) {
        abbrMap[node.abbr] = "*[".concat(node.abbr, "]: ").concat(node.reference);
      }

      return "".concat(node.abbr);
    };

    var originalRootCompiler = visitors.root;

    visitors.root = function (node) {
      return "".concat(originalRootCompiler.apply(this, arguments), "\n").concat(Object.values(abbrMap).join('\n'));
    };
  }

  return transformer;
}

module.exports = plugin;