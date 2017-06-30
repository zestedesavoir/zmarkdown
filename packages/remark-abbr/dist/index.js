'use strict';

function plugin() {
  function locator(value, fromIndex) {
    return value.indexOf('*[', fromIndex);
  }

  function inlineTokenizer(eat, value, silent) {
    var regex = new RegExp(/[*]\[([^\]]*)\]:\s*(.+)\n*/);
    var keep = regex.exec(value

    /* istanbul ignore if - never used (yet) */
    );if (silent) return silent;
    if (!keep || keep.index !== 0) return;

    return eat(keep[0])({
      type: 'abbr',
      children: [{ type: 'text', value: keep[1] }],
      data: {
        hName: 'abbr',
        hProperties: {
          'data-abbr': keep[1],
          title: keep[2]
        }
      }
    });
  }
  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.abbr = inlineTokenizer;
  inlineMethods.splice(0, 0, 'abbr');
}

module.exports = plugin;