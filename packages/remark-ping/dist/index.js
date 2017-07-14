'use strict';

function plugin(ctx) {
  var _this = this;

  if (!ctx.pingUsername || typeof ctx.pingUsername !== 'function') {
    throw new Error('remark-ping: expected configuration to be passed: {\n  pingUsername: (username) => bool,\n  userURL: (username) => string\n}');
  }
  if (!ctx.userURL || typeof ctx.userURL !== 'function') {
    throw new Error('remark-ping: expected configuration to be passed: {\n  pingUsername: (username) => bool,\n  userURL: (username) => string\n}');
  }

  var pattern = ctx.usernameRegex || /[\s'"(,:<]?@(?:\*\*([^*]+)\*\*|(\w+))/;

  function inlineTokenizer(eat, value, silent) {
    var keep = pattern.exec(value);
    if (!keep || keep.index > 0) return;

    var total = keep[0];
    var username = keep[2] ? keep[2] : keep[1];

    if (ctx.pingUsername(username)) {
      var url = ctx.userURL(username);
      return eat(total)({
        type: 'ping',
        _metadata: username,
        url: url,
        children: [{
          type: 'text',
          value: username
        }],
        data: {
          hName: 'a',
          hProperties: {
            href: url,
            class: 'ping'
          }
        }
      });
    } else {
      return eat(total[0])({
        type: 'text',
        value: total[0]
      });
    }
  }

  function locator(value, fromIndex) {
    var keep = pattern.exec(value, fromIndex);
    if (keep) {
      return value.indexOf('@', keep.index);
    }
    return -1;
  }

  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.ping = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'ping');

  var Compiler = this.Compiler;

  // Stringify
  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    visitors.ping = function (node) {
      return '@**' + _this.all(node).join('') + '**';
    };
  }
}

module.exports = plugin;
