'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var spaceSeparated = require('space-separated-tokens');

function escapeRegExp(str) {
  return str.replace(/[-[]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

var C_NEWLINE = '\n';
var C_FENCE = '|';

module.exports = function blockPlugin() {
  var availableBlocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var pattern = Object.keys(availableBlocks).map(escapeRegExp).join('|');

  if (!pattern) {
    throw new Error('remark-custom-blocks needs to be passed a configuration object as option');
  }

  var regex = new RegExp('\\[\\[(' + pattern + ')(?: *\\| *(.*))?\\]\\]');

  function blockTokenizer(eat, value, silent) {
    var now = eat.now();
    var keep = regex.exec(value);
    if (!keep) return;
    if (keep.index !== 0) return;

    var _keep = _slicedToArray(keep, 3),
        eaten = _keep[0],
        blockType = _keep[1],
        blockTitle = _keep[2];

    /* istanbul ignore if - never used (yet) */


    if (silent) return true;

    var linesToEat = [];
    var content = [];

    var idx = 0;
    while ((idx = value.indexOf(C_NEWLINE)) !== -1) {
      var next = value.indexOf(C_NEWLINE, idx + 1);
      // either slice until next NEWLINE or slice until end of string
      var lineToEat = next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1);
      if (lineToEat[0] !== C_FENCE) break;
      // remove leading `FENCE ` or leading `FENCE`
      var line = lineToEat.slice(lineToEat.startsWith(C_FENCE + ' ') ? 2 : 1);
      linesToEat.push(lineToEat);
      content.push(line);
      value = value.slice(idx + 1);
    }

    var contentString = content.join(C_NEWLINE);
    var stringToEat = eaten + C_NEWLINE + linesToEat.join(C_NEWLINE);

    var potentialBlock = availableBlocks[blockType];
    var titleAllowed = potentialBlock.title && ['optional', 'required'].includes(potentialBlock.title);
    var titleRequired = potentialBlock.title && potentialBlock.title === 'required';

    if (titleRequired && !blockTitle) return;
    if (!titleAllowed && blockTitle) return;
    var add = eat(stringToEat);

    var exit = this.enterBlock();
    var contents = {
      type: blockType + 'CustomBlockBody',
      data: {
        hName: 'div',
        hProperties: {
          className: 'custom-block-body'
        }
      },
      children: this.tokenizeBlock(contentString, now)
    };
    exit();

    var blockChildren = [contents];
    if (titleAllowed && blockTitle) {
      var titleNode = {
        type: blockType + 'CustomBlockHeading',
        data: {
          hName: 'div',
          hProperties: {
            className: 'custom-block-heading'
          }
        },
        children: this.tokenizeInline(blockTitle, now)
      };
      blockChildren.unshift(titleNode);
    }

    var classList = spaceSeparated.parse(potentialBlock.classes || '');

    return add({
      type: blockType + 'CustomBlock',
      children: blockChildren,
      data: {
        hName: 'div',
        hProperties: {
          className: ['custom-block'].concat(_toConsumableArray(classList))
        }
      }
    });
  }

  var Parser = this.Parser;

  // Inject blockTokenizer
  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.customBlocks = blockTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'customBlocks');

  // Inject into interrupt rules
  var interruptParagraph = Parser.prototype.interruptParagraph;
  var interruptList = Parser.prototype.interruptList;
  var interruptBlockquote = Parser.prototype.interruptBlockquote;
  interruptParagraph.splice(interruptParagraph.indexOf('fencedCode') + 1, 0, ['customBlocks']);
  interruptList.splice(interruptList.indexOf('fencedCode') + 1, 0, ['customBlocks']);
  interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode') + 1, 0, ['customBlocks']);
};