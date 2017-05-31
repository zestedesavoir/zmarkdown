'use strict';

var SPACE = ' ';
var markers = {
  '~': 'sub',
  '^': 'sup'
};

function locator(value, fromIndex) {
  var index = -1;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(markers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var marker = _step.value;

      index = value.indexOf(marker, fromIndex);
      if (index !== -1) return index;
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

  return index;
}

function inlinePlugin() {
  function inlineTokenizer(eat, value, silent) {
    // allow escaping of all markers
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.keys(markers)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _marker = _step2.value;

        if (!this.escape.includes(_marker)) this.escape.push(_marker);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var marker = value[0];
    var now = eat.now();
    now.column += 1;
    now.offset += 1;

    if (markers.hasOwnProperty(marker) && !value.startsWith(marker + SPACE) && !value.startsWith(marker + marker)) {
      var endMarkerIndex = 1;
      for (; value[endMarkerIndex] !== marker && endMarkerIndex < value.length; endMarkerIndex++) {}

      // if it's actually empty, don't tokenize (disallows e.g. <sup></sup>)
      if (endMarkerIndex === value.length) return;

      /* istanbul ignore if - never used (yet) */
      if (silent) return true;

      eat(value.substring(0, endMarkerIndex + 1))({
        type: markers[marker],
        children: this.tokenizeInline(value.substring(1, endMarkerIndex), now),
        data: {
          hName: markers[marker]
        }
      });
    }
  }

  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.sub_super = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'sub_super');
}

module.exports = inlinePlugin;