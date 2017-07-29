'use strict';

var beginMarkerFactory = function beginMarkerFactory() {
  var marker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'COMMENTS';
  return '<--' + marker;
};
var endMarkerFactory = function endMarkerFactory() {
  var marker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'COMMENTS';
  return marker + '-->';
};
var SPACE = ' ';

function plugin() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var beginMarker = beginMarkerFactory(opts.beginMarker);
  var endMarker = endMarkerFactory(opts.endMarker);

  function locator(value, fromIndex) {
    return value.indexOf(beginMarker, fromIndex);
  }

  function inlineTokenizer(eat, value, silent) {

    var keepBegin = value.indexOf(beginMarker);
    var keepEnd = value.indexOf(endMarker);
    if (keepBegin !== 0 || keepEnd === -1) return;

    /* istanbul ignore if - never used (yet) */
    if (silent) return true;

    var comment = value.substring(beginMarker.length + 1, keepEnd - 1);
    return eat(beginMarker + SPACE + comment + SPACE + endMarker);
  }
  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.comments = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'comments');
}

module.exports = plugin;