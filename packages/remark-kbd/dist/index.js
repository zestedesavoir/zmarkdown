'use strict';

var whitespace = require('is-whitespace-character');

var C_PIPE = '|';
var DOUBLE = '||';

function locator(value, fromIndex) {
  var index = value.indexOf(DOUBLE, fromIndex);
  return index;
}

function plugin() {
  function inlineTokenizer(eat, value, silent) {
    if (!this.options.gfm || value.substr(0, 2) !== DOUBLE || value.substr(0, 4) === DOUBLE + DOUBLE || whitespace(value.charAt(2))) {
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

      if (character === C_PIPE && previous === C_PIPE && (!preceding || !whitespace(preceding))) {

        /* istanbul ignore if - never used (yet) */
        if (silent) return true;

        return eat(DOUBLE + subvalue + DOUBLE)({
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

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.kbd = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'kbd');

  var Compiler = this.Compiler;

  // Stringify
  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    visitors.kbd = function (node) {
      return '||' + this.all(node).join('') + '||';
    };
  }
}

module.exports = plugin;