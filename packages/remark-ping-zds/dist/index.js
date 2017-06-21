'use strict';

var request = require('sync-request');

var pattern = /[\s'"(,:<]?@(?:\*\*([^*]+)\*\*|(\w+))/;

function locator(value, fromIndex) {
  var keep = pattern.exec(value, fromIndex);
  if (keep) {
    return value.indexOf('@', keep.index);
  }
  return -1;
}

function plugin() {
  function zdsMemberExists(username) {
    var isMember = false;
    var res = request('GET', 'http://zestedesavoir.com/api/membres/?search=' + username);
    var data = JSON.parse(res.getBody('utf-8'));
    isMember = data.count && data.count > 0;
    return isMember;
  }

  function inlineTokenizer(eat, value, silent) {
    var keep = pattern.exec(value);
    if (!keep || keep.index > 0) return;

    var total = keep[0];
    var username = keep[2] ? keep[2] : keep[1];

    if (zdsMemberExists(username)) {
      return eat(total)({
        type: 'ping',
        children: [{
          type: 'text',
          value: username
        }],
        data: {
          hName: 'a',
          hProperties: {
            href: '/membres/voir/' + username + '/',
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
  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.zping = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'zping');
}

module.exports = plugin;