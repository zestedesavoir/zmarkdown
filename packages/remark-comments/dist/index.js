'use strict';

var BEGINMARKER = '<--COMMENTS';
var ENDMARKER = 'COMMENTS-->';
var SPACE = ' ';

function locator(value, fromIndex) {
  return value.indexOf(BEGINMARKER, fromIndex);
}

function plugin() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  function inlineTokenizer(eat, value, silent) {

    var keepBegin = value.indexOf(BEGINMARKER);
    var keepEnd = value.indexOf(ENDMARKER);
    if (keepBegin !== 0 || keepEnd === -1) return;

    /* istanbul ignore if - never used (yet) */
    if (silent) return true;

    var comment = value.substring(BEGINMARKER.length + 1, keepEnd - 1);
    return eat(BEGINMARKER + SPACE + comment + SPACE + ENDMARKER);
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