"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

module.exports = function inlinePlugin(ctx) {
  var emoticonClasses = ctx && ctx.classes;
  var emoticons = ctx && ctx.emoticons;

  if (!emoticons) {
    throw new Error('remark-emoticons needs to be passed a configuration object as option');
  }

  for (var _i = 0, _Object$entries = Object.entries(emoticons); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        val = _Object$entries$_i[1];

    emoticons[key.toLowerCase()] = val;
  }

  var pattern = Object.keys(emoticons).map(escapeRegExp).join('|');
  var regex = new RegExp("(?:\\s|^)(".concat(pattern, ")(?:\\s|$)"), 'i');

  function locator(value, fromIndex) {
    var keep = regex.exec(value);

    if (keep) {
      var index = keep.index;

      while (/^\s/.test(value.charAt(index))) {
        index++;
      }

      return index;
    }

    return -1;
  }

  function inlineTokenizer(eat, value, silent) {
    var keep = regex.exec(value);

    if (keep) {
      if (keep.index !== 0) return true;
      if (!keep[0].startsWith(keep[1])) return true;
      /* istanbul ignore if - never used (yet) */

      if (silent) return true;
      var toEat = keep[1];
      var emoticon = toEat.trim();
      var src = emoticons[emoticon.toLowerCase()];
      var emoticonNode = {
        type: 'emoticon',
        value: emoticon,
        data: {
          hName: 'img',
          hProperties: {
            src: src,
            alt: emoticon
          }
        }
      };

      if (emoticonClasses) {
        emoticonNode.data.hProperties["class"] = emoticonClasses;
      }

      eat(toEat)(emoticonNode);
    }
  }

  inlineTokenizer.locator = locator;
  var Parser = this.Parser; // Inject inlineTokenizer

  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.emoticons = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'emoticons');
  var Compiler = this.Compiler;

  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    if (!visitors) return;

    visitors.emoticon = function (node) {
      return node.value;
    };
  }
};