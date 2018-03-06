'use strict';

var beginMarkerFactory = function beginMarkerFactory() {
  var marker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'COMMENTS';
  return '<--' + marker + ' ';
};
var endMarkerFactory = function endMarkerFactory() {
  var marker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'COMMENTS';
  return ' ' + marker + '-->';
};

function plugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$beginMarker = _ref.beginMarker,
      beginMarker = _ref$beginMarker === undefined ? 'COMMENTS' : _ref$beginMarker,
      _ref$endMarker = _ref.endMarker,
      endMarker = _ref$endMarker === undefined ? 'COMMENTS' : _ref$endMarker;

  beginMarker = beginMarkerFactory(beginMarker);
  endMarker = endMarkerFactory(endMarker);

  function locator(value, fromIndex) {
    return value.indexOf(beginMarker, fromIndex);
  }

  function inlineTokenizer(eat, value, silent) {
    var keepBegin = value.indexOf(beginMarker);
    var keepEnd = value.indexOf(endMarker);
    if (keepBegin !== 0 || keepEnd === -1) return;

    /* istanbul ignore if - never used (yet) */
    if (silent) return true;

    var comment = value.substring(beginMarker.length, keepEnd);
    return eat(beginMarker + comment + endMarker)({
      type: 'comments',
      value: '',
      data: { comment: comment }
    });
  }
  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.comments = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'comments');

  var Compiler = this.Compiler;
  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    if (!visitors) return;
    visitors.comments = function (node) {
      return beginMarker + node.data.comment + endMarker;
    };
  }
}

module.exports = plugin;