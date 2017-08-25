'use strict';

/* Dependencies. */
var all = require('rebber/dist/all');

/* Expose. */
module.exports = abbr;

function abbr(ctx, node) {
  var displayedText = all(ctx, node);
  var signification = node.data.hProperties.title;
  if (ctx.abbr && typeof ctx.abbr === 'function') {
    return ctx.abbr(displayedText, signification);
  }
  return '\\abbr{' + displayedText + '}{' + signification + '}';
}