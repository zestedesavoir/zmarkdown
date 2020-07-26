"use strict";

var whitespace = require('is-whitespace-character');

var DEFAULT_LEFT = '|';
var DEFAULT_RIGHT = '|';

function plugin(config) {
  var CHAR_LEFT = config && config.charLeft || DEFAULT_LEFT;
  var CHAR_RIGHT = config && config.charRight || DEFAULT_RIGHT;
  var DOUBLE_LEFT = CHAR_LEFT + CHAR_LEFT;
  var DOUBLE_RIGHT = CHAR_RIGHT + CHAR_RIGHT;

  function locator(value, fromIndex) {
    var index = value.indexOf(DOUBLE_LEFT, fromIndex);
    return index;
  }

  function inlineTokenizer(eat, value, silent) {
    if (!this.options.gfm || value.substr(0, 2) !== DOUBLE_LEFT || value.substr(0, 4) === DOUBLE_LEFT + DOUBLE_RIGHT || whitespace(value.charAt(2))) {
      return;
    }

    var character = '';
    var previous = '';
    var preceding = '';
    var subvalue = '';
    var index = 1;
    var length = value.length;
    var now = eat.now();
    now.column += 2;
    now.offset += 2;

    while (++index < length) {
      character = value.charAt(index);

      if (character === CHAR_RIGHT && previous === CHAR_RIGHT && (!preceding || !whitespace(preceding))) {
        /* istanbul ignore if - never used (yet) */
        if (silent) return true;
        return eat(DOUBLE_LEFT + subvalue + DOUBLE_RIGHT)({
          type: 'kbd',
          children: this.tokenizeInline(subvalue, now),
          data: {
            hName: 'kbd'
          }
        });
      }

      subvalue += previous;
      preceding = previous;
      previous = character;
    }
  }

  inlineTokenizer.locator = locator;
  var Parser = this.Parser; // Inject inlineTokenizer

  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.kbd = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'kbd');
  var Compiler = this.Compiler; // Stringify

  if (Compiler) {
    var visitors = Compiler.prototype.visitors;

    visitors.kbd = function (node) {
      return "".concat(DOUBLE_LEFT).concat(this.all(node).join('')).concat(DOUBLE_RIGHT);
    };
  }
}

module.exports = plugin;