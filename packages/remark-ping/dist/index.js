'use strict';

var visit = require('unist-util-visit');

var helpMsg = 'remark-ping: expected configuration to be passed: {\n  pingUsername: (username) => bool,\n  userURL: (username) => string\n}';

module.exports = function plugin(_ref) {
  var pingUsername = _ref.pingUsername,
      userURL = _ref.userURL,
      _ref$usernameRegex = _ref.usernameRegex,
      usernameRegex = _ref$usernameRegex === undefined ? /[\s'"(,:<]?@(?:\*\*([^*]+)\*\*|(\w+))/ : _ref$usernameRegex;

  if (typeof pingUsername !== 'function' || typeof userURL !== 'function') {
    throw new Error(helpMsg);
  }

  function inlineTokenizer(eat, value, silent) {
    var keep = usernameRegex.exec(value);
    if (!keep || keep.index > 0) return;

    var total = keep[0];
    var username = keep[2] ? keep[2] : keep[1];

    if (pingUsername(username) === true) {
      var url = userURL(username);

      return eat(total)({
        type: 'ping',
        username: username,
        url: url,
        children: [{
          type: 'text',
          value: username
        }],
        data: {
          hName: 'a',
          hProperties: {
            href: url,
            class: 'ping',
            rel: 'nofollow'
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
    var keep = usernameRegex.exec(value, fromIndex);
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
      return '@**' + node.username + '**';
    };
  }

  return function (tree, file) {
    visit(tree, 'blockquote', markInBlockquotes);
    visit(tree, 'ping', function (node) {
      if (!node.__inBlockquote) {
        if (!file.data[node.type]) {
          file.data[node.type] = [];
        }
        file.data[node.type].push(node.username);
      }
    });
  };
};

function markInBlockquotes(node) {
  mark(node);

  if (node.children) {
    node.children.map(function (n, i) {
      return markInBlockquotes(n);
    });
  }
}

function mark(node) {
  if (node.type === 'ping') node.__inBlockquote = true;
}