'use strict';

/* Dependencies. */
var all = require('rebber/dist/all');

/* Expose. */
module.exports = abbr;

function abbr(ctx, node) {
  var displayText = all(ctx, node);
  var meaning = node.data.hProperties.title;
  if (ctx.abbr && typeof ctx.abbr === 'function') {
    return ctx.abbr(displayText, meaning);
  }
  return '\\abbr{' + displayText + '}{' + meaning + '}';
}