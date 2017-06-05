'use strict';

var C_NEWLINE = '\n';
var C_NEWPARAGRAPH = '\n\n';

module.exports = function plugin() {
  var classNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var regex = new RegExp('->(.+)');
  var endMarkers = ['->', '<-'];

  function alignTokenizer(eat, value, silent) {
    var now = eat.now();
    var keep = regex.exec(value);
    if (!keep) return;
    if (keep.index !== 0) return;

    /* istanbul ignore if - never used (yet) */
    if (silent) return true;

    var idx = 0;
    var linesToEat = [];
    var finishedBlocks = [];
    var endMarker = '';
    var canEatLine = true;
    while (canEatLine) {
      var next = value.indexOf(C_NEWLINE, idx + 1);
      var lineToEat = next !== -1 ? value.slice(idx, next) : value.slice(idx);
      linesToEat.push(lineToEat);

      if (lineToEat.length > 2 && endMarkers.indexOf(lineToEat.slice(-2)) !== -1) {
        if (endMarker === '') endMarker = lineToEat.slice(-2);

        finishedBlocks.push(linesToEat.join(C_NEWLINE));
        // Check if another block is following
        if (value.indexOf('->', next) !== next + 1) break;else linesToEat = [];
      }

      idx = next + 1;
      canEatLine = next !== -1;
    }

    if (finishedBlocks.length === 0) return;
    var stringToEat = '';
    finishedBlocks.forEach(function (block) {
      stringToEat += block.slice(2, -2) + C_NEWPARAGRAPH;
    });

    var add = eat(finishedBlocks.join(C_NEWLINE));
    var exit = this.enterBlock();
    var contents = this.tokenizeBlock(stringToEat, now);
    exit();

    var elementType = endMarker === '->' ? 'RightAligned' : 'CenterAligned';
    var rightClassName = classNames.right ? classNames.right : 'align-right';
    var centerClassName = classNames.center ? classNames.center : 'align-center';
    var className = endMarker === '->' ? rightClassName : centerClassName;
    return add({
      type: elementType,
      children: contents,
      data: {
        hName: 'div',
        hProperties: {
          class: className
        }
      }
    });
  }

  var Parser = this.Parser;

  // Inject blockTokenizer
  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.align_blocks = alignTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'align_blocks');
};