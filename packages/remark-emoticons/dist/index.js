'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

var SPACE = ' ';

module.exports = function inlinePlugin(ctx) {
  var emoticonClasses = ctx && ctx.classes;
  var emoticons = ctx && ctx.emoticons;

  if (!emoticons) {
    throw new Error('remark-emoticons needs to be passed a configuration object as option');
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(emoticons)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = _slicedToArray(_ref, 2);

      var key = _ref2[0];
      var val = _ref2[1];

      emoticons[key.toLowerCase()] = val;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var pattern = Object.keys(emoticons).map(escapeRegExp).join('|');

  var regex = new RegExp('(\\s|^)(' + pattern + ')(\\s|$)', 'i');

  function locator(value, fromIndex) {
    var keep = regex.exec(value);
    if (keep && value[keep.index] === SPACE) return keep.index + 1;
    return -1;
  }

  function inlineTokenizer(eat, value, silent) {
    var keep = regex.exec(value);
    if (keep) {
      if (keep.index !== 0) return true;

      /* istanbul ignore if - never used (yet) */
      if (silent) return true;

      var toEat = keep[0];
      if (toEat.charAt(toEat.length - 1) === SPACE) {
        toEat = toEat.substring(0, toEat.length - 1);
      }
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
        emoticonNode.data.hProperties.class = emoticonClasses;
      }

      eat(toEat)(emoticonNode);
    }
  }

  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
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