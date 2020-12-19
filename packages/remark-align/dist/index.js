"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var spaceSeparated = require('space-separated-tokens');

var C_NEWLINE = '\n';
var C_NEWPARAGRAPH = '\n\n';

module.exports = function plugin() {
  var classNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var locateMarker = new RegExp("[^\\\\]?(->|<-)");
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
      var endIndex = endMarkers.indexOf(lineToEat.slice(-2)); // If nextIndex = (blockStartIndex + 2), it's the first marker of the block.

      if ((nextIndex > blockStartIndex + 2 || nextIndex === -1) && lineToEat.length >= 2 && endIndex !== -1) {
        if (endMarker === '') endMarker = lineToEat.slice(-2);
        finishedBlocks.push(linesToEat.join(C_NEWLINE)); // Check if another block is following

        if (value.indexOf('->', nextIndex) !== nextIndex + 1) break;
        linesToEat = [];
        blockStartIndex = nextIndex + 1;
      }

      index = nextIndex + 1;
      canEatLine = nextIndex !== -1;
    }

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

    if (!elementType) return;
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
    return add({
      type: elementType,
      children: values,
      data: {
        hName: 'div',
        hProperties: {
          "class": spaceSeparated.parse(classes)
        }
      }
    });
  }

  var Parser = this.Parser; // Inject blockTokenizer

  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.alignBlocks = alignTokenizer;
  blockMethods.splice(blockMethods.indexOf('list') + 1, 0, 'alignBlocks');
  var Compiler = this.Compiler; // Stringify

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

      if (innerContent.length < 2) return "".concat(start, " ").concat(innerContent.join('\n').trim(), " ").concat(end);
      return "".concat(start, "\n").concat(innerContent.join('\n\n').trim(), "\n").concat(end);
    };

    visitors.leftAligned = alignCompiler;
    visitors.rightAligned = alignCompiler;
    visitors.centerAligned = alignCompiler;
  }
};