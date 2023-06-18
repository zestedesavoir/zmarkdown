"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text, protect) {
  return "".concat(protect ? '\\protect' : '', "\\footnotetext[").concat(identifier, "]{").concat(text, "}");
};

function notes(ctx, node) {
  var macro = ctx.footnoteDefinition || defaultMacro;
  var protect = Boolean(node.commandProtect);
  return macro(node.identifier, all(ctx, node).trim(), protect);
}