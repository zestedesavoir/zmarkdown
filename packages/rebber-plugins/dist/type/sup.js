"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = sup;
/* Stringify a sup `node`. */

function sup(ctx, node, index, parent) {
  var contents = all(ctx, node);
  return "\\textsuperscript{".concat(contents, "}");
}