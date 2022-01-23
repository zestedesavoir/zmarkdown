"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');

var escape = require('rebber/dist/escaper');
/* Expose. */


module.exports = abbrPlugin;

function abbrPlugin(ctx, node) {
  var abbr = all(ctx, node);
  var reference = escape(node.reference);

  if (ctx.abbr && typeof ctx.abbr === 'function') {
    return ctx.abbr(abbr, reference);
  }

  return "\\abbr{".concat(abbr, "}{").concat(reference, "}");
}