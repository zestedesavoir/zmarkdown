'use strict';

module.exports = function alignPlugin() {

  function headingTokenizer(eat, value, silent) {
    /* istanbul ignore if - never used (yet) */
    if (silent) return true;

    var lines = value.match(/.*\n/g) || [];
    // Check if first line is not empty,
    // here, we don't use \s because a line with a tab is not empty
    if (/^$| +/.exec(lines[0])) return;
    // and if the second line is a heading with trailing spaces
    if (!/^-+|=+\s+\n?$/.exec(lines[1])) return;

    var now = eat.now();
    var head = lines[0] + lines[1];
    var add = eat(head);
    var exit = this.enterBlock();
    exit();

    return add({
      type: 'heading',
      depth: lines[1][0] === '=' ? 1 : 2,
      children: this.tokenizeInline(lines[0].slice(0, -1), now)
    });
  }

  var Parser = this.Parser;

  // Inject blockTokenizer
  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.heading_blocks = headingTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'heading_blocks');
};