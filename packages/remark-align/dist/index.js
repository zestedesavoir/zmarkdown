'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var spaceSeparated = require('space-separated-tokens');

var C_NEWLINE = '\n';
var C_NEWPARAGRAPH = '\n\n';

module.exports = function plugin() {
  var classNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var locateMarker = new RegExp('[^\\\\]?(->|<-)');
  var endMarkers = ['->', '<-'];

  function alignTokenizer(eat, value, silent) {
    var keep = value.match(locateMarker);
    if (!keep || keep.index !== 0) return;

    var now = eat.now();

    var _keep = _slicedToArray(keep, 2),
        startMarker = _keep[1];

    /* istanbul ignore if - never used (yet) */


    if (silent) return true;

    var index = 0;
    var linesToEat = [];
    var finishedBlocks = [];
    var endMarker = '';
    var canEatLine = true;
    var blockStartIndex = 0;

    while (canEatLine) {
      var nextIndex = value.indexOf(C_NEWLINE, index + 1);
      var lineToEat = nextIndex !== -1 ? value.slice(index, nextIndex) : value.slice(index);

      linesToEat.push(lineToEat);

      var endIndex = endMarkers.indexOf(lineToEat.slice(-2));

      // If nextIndex = (blockStartIndex + 2), it's the first marker of the block.
      if ((nextIndex > blockStartIndex + 2 || nextIndex === -1) && lineToEat.length >= 2 && endIndex !== -1) {

        if (endMarker === '') endMarker = lineToEat.slice(-2);

        finishedBlocks.push(linesToEat.join(C_NEWLINE));

        // Check if another block is following
        if (value.indexOf('->', nextIndex) !== nextIndex + 1) break;
        linesToEat = [];
        blockStartIndex = nextIndex + 1;
      }

      index = nextIndex + 1;
      canEatLine = nextIndex !== -1;
    }

    if (finishedBlocks.length === 0) return;
    var stringToEat = '';
    var marker = finishedBlocks[0].substring(finishedBlocks[0].length - 2, finishedBlocks[0].length);
    var toEat = [];
    for (var i = 0; i < finishedBlocks.length; ++i) {
      var block = finishedBlocks[i];
      if (marker !== block.substring(block.length - 2, block.length)) break;
      toEat.push(block);
      stringToEat += block.slice(2, -2) + C_NEWPARAGRAPH;
    }

    var add = eat(toEat.join(C_NEWLINE));
    var exit = this.enterBlock();
    var values = this.tokenizeBlock(stringToEat, now);
    exit();

    var elementType = '';
    var classes = '';
    if (startMarker === '<-' && endMarker === '<-') {
      elementType = 'leftAligned';
      classes = classNames.left ? classNames.left : 'align-left';
    }
    if (startMarker === '->') {
      if (endMarker === '<-') {
        elementType = 'centerAligned';
        classes = classNames.center ? classNames.center : 'align-center';
      }
      if (endMarker === '->') {
        elementType = 'rightAligned';
        classes = classNames.right ? classNames.right : 'align-right';
      }
    }

    return add({
      type: elementType,
      children: values,
      data: {
        hName: 'div',
        hProperties: {
          class: spaceSeparated.parse(classes)
        }
      }
    });
  }

  var Parser = this.Parser;

  // Inject blockTokenizer
  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.alignBlocks = alignTokenizer;
  blockMethods.splice(blockMethods.indexOf('list') + 1, 0, 'alignBlocks');

  var Compiler = this.Compiler;

  // Stringify
  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    if (!visitors) return;

    var alignCompiler = function alignCompiler(node) {
      var innerContent = this.all(node);

      var markers = {
        left: ['<-', '<-'],
        right: ['->', '->'],
        center: ['->', '<-']
      };
      var alignType = node.type.slice(0, -7);

      if (!markers[alignType]) return innerContent.join('\n\n');

      var _markers$alignType = _slicedToArray(markers[alignType], 2),
          start = _markers$alignType[0],
          end = _markers$alignType[1];

      if (innerContent.length < 2) return start + ' ' + innerContent.join('\n').trim() + ' ' + end;

      return start + '\n' + innerContent.join('\n\n').trim() + '\n' + end;
    };
    visitors.leftAligned = alignCompiler;
    visitors.rightAligned = alignCompiler;
    visitors.centerAligned = alignCompiler;
  }
};