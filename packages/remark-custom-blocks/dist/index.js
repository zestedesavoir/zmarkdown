'use strict';

var spaceSeparated = require('space-separated-tokens');

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

var C_NEWLINE = '\n';
var C_FENCE = '|';

module.exports = function blockPlugin() {
  var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var allowTitle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var pattern = Object.keys(blocks).map(escapeRegExp).join('|');
  if (!pattern) {
    throw new Error('remark-custom-blocks needs to be passed a configuration object as option');
  }
  var regex = new RegExp('\\[\\[(' + pattern + ')\\]\\]');
  if (allowTitle) {
    regex = new RegExp('\\[\\[(' + pattern + ')( ?\\| ?((\\w| |\'|-|")+))?\\]\\]');
  }
  function blockTokenizer(eat, value, silent) {
    var now = eat.now();
    var keep = regex.exec(value);
    if (!keep) return;
    if (keep.index !== 0) return;

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
    var stringToEat = '' + keep[0] + C_NEWLINE + linesToEat.join(C_NEWLINE);

    var add = eat(stringToEat);
    var exit = this.enterBlock();
    var contents = {
      type: 'body' + keep[1] + 'CustomBlock',
      data: {
        hName: 'div',
        hProperties: {
          className: 'custom-block-body'
        }
      },
      children: this.tokenizeBlock(contentString, now)
    };

    exit();

    var classString = blocks[keep[1]];
    var classList = spaceSeparated.parse(classString);
    var blockChildren = [contents];
    if (allowTitle && keep[3]) {
      var titleNode = {
        type: 'heading' + keep[1] + 'CustomBlock',
        data: {
          hName: 'div',
          hProperties: {
            className: 'custom-block-heading'
          }
        },
        children: [{
          value: keep[3],
          type: 'text'
        }]
      };
      blockChildren.splice(0, 0, titleNode);
    }

    return add({
      type: keep[1] + 'CustomBlock',
      children: blockChildren,
      data: {
        hName: 'div',
        hProperties: {
          className: 'custom-block ' + classList
        }
      }
    });
  }

  var Parser = this.Parser;

  // Inject blockTokenizer
  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.custom_blocks = blockTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'custom_blocks');

  // Inject into interrupt rules
  var interruptParagraph = Parser.prototype.interruptParagraph;
  var interruptList = Parser.prototype.interruptList;
  var interruptBlockquote = Parser.prototype.interruptBlockquote;
  interruptParagraph.splice(interruptParagraph.indexOf('fencedCode') + 1, 0, ['custom_blocks']);
  interruptList.splice(interruptList.indexOf('fencedCode') + 1, 0, ['custom_blocks']);
  interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode') + 1, 0, ['custom_blocks']);
};