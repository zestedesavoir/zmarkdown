'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

module.exports = function escapeEscaped() {
  var entitiesToKeep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['&'];

  if (!Array.isArray(entitiesToKeep) || !entitiesToKeep.length) {
    throw new Error('remark-escape-escaped needs to be passed a configuration array as option');
  }
  var pattern = entitiesToKeep.map(escapeRegExp).join('|');
  var regex = new RegExp('(' + pattern + ')');

  function locator(value, fromIndex) {
    var indices = entitiesToKeep.map(function (entity) {
      return value.indexOf(entity, fromIndex);
    });
    return Math.min.apply(Math, _toConsumableArray(indices));
  }

  function inlineTokenizer(eat, value, silent) {
    var keep = regex.exec(value);
    if (keep) {
      if (keep.index !== 0) return true;

      /* istanbul ignore if - never used (yet) */
      if (silent) return true;

      eat(keep[0])({
        type: 'text',
        value: keep[0]
      });
    }
  }
  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.keep_entities = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'keep_entities');
};