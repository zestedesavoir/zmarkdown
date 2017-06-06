'use strict';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

var SPACE = ' ';

module.exports = function inlinePlugin() {
  var emoticons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var pattern = Object.keys(emoticons).map(escapeRegExp).join('|');

  if (!pattern) {
    throw new Error('remark-emoticons needs to be passed a configuration object as option');
  }

  var regex = new RegExp('(\\s|^)(' + pattern + ')(\\s|$)');

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

      eat(toEat)({
        type: 'emoticon',
        code: emoticon,
        data: {
          hName: 'img',
          hProperties: {
            src: emoticons[emoticon],
            alt: emoticon
          }
        }
      });
    }
  }

  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.emoticons = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'emoticons');
};