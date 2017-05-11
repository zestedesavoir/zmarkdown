'use strict';

var C_NEWLINE = '\n';
var C_NEWPARAGRAPH = '\n\n';

module.exports = function alignPlugin() {
  var regex = new RegExp('->(.+)');
  var endMarkers = ['->', '<-'];

  function alignTokenizer(eat, value, silent) {
    var now = eat.now();
    var keep = regex.exec(value);
    if (!keep) return;
    if (keep.index !== 0) return;
    if (silent) return;

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
        if (lineToEat.slice(-2) !== endMarker) break;else {
          finishedBlocks.push(linesToEat.join(C_NEWLINE));
          // Check if another block is following
          if (value.indexOf('->', next) !== next + 1) break;else linesToEat = [];
        }
      }

      idx = next + 1;
      canEatLine = next !== -1;
    }

    if (finishedBlocks.length === 0) return;
    var stringToEat = '';
    finishedBlocks.forEach(function (block) {
      var contentBlock = block.slice(2, -2);
      if (contentBlock.length > 0) {
        stringToEat += block.slice(2, -2) + C_NEWPARAGRAPH;
      }
    });

    var add = eat(finishedBlocks.join(C_NEWLINE));
    var exit = this.enterBlock();
    var contents = this.tokenizeBlock(stringToEat, now);
    exit();

    var type = endMarker === '->' ? 'align-right' : 'align-center';
    return add({
      type: type,
      children: contents,
      data: {
        hName: 'div',
        hProperties: {
          class: type
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