"use strict";

var SPACE = ' ';
var markers = {
  '~': 'sub',
  '^': 'sup'
};

function locator(value, fromIndex) {
  var index = -1;
  var found = [];

  for (var _i = 0, _Object$keys = Object.keys(markers); _i < _Object$keys.length; _i++) {
    var marker = _Object$keys[_i];
    index = value.indexOf(marker, fromIndex);

    if (index !== -1) {
      found.push(index);
      continue;
    }
  }

  if (found.length) {
    found.sort(function (a, b) {
      return a - b;
    });
    return found[0];
  }

  return -1;
}

function inlinePlugin() {
  function inlineTokenizer(eat, value, silent) {
    // allow escaping of all markers
    for (var _i2 = 0, _Object$keys2 = Object.keys(markers); _i2 < _Object$keys2.length; _i2++) {
      var _marker = _Object$keys2[_i2];
      if (!this.escape.includes(_marker)) this.escape.push(_marker);
    }

    var marker = value[0];
    var now = eat.now();
    now.column += 1;
    now.offset += 1;

    if (markers.hasOwnProperty(marker) && !value.startsWith(marker + SPACE) && !value.startsWith(marker + marker)) {
      var endMarkerIndex = 1;

      for (; value[endMarkerIndex] !== marker && endMarkerIndex < value.length; endMarkerIndex++) {
        ;
      } // if it's actually empty, don't tokenize (disallows e.g. <sup></sup>)


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
  var Parser = this.Parser; // Inject inlineTokenizer

  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.sub_super = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'sub_super');
}

module.exports = inlinePlugin;