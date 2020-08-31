"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text, protect) {
  return (// eslint-disable-next-line max-len
    "".concat(protect ? '\\protect' : '', "\\footnotetext[").concat(identifier, "]{\\footnotemark{footnote:").concat(identifier, "} ").concat(text, "}")
  );
};

function notes(ctx, node) {
  var macro = ctx.footnoteDefinition || defaultMacro;
  var protect = Boolean(node.inHeading);
  return macro(node.identifier, all(ctx, node).trim(), protect);
}