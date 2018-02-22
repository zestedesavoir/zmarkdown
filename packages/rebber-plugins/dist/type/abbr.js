'use strict';

/* Dependencies. */
var all = require('rebber/dist/all');

/* Expose. */
module.exports = abbrPlugin;

function abbrPlugin(ctx, node) {
  var abbr = all(ctx, node);
  var reference = node.reference;
  if (ctx.abbr && typeof ctx.abbr === 'function') {
    return ctx.abbr(abbr, reference);
  }
  return '\\abbr{' + abbr + '}{' + reference + '}';
}