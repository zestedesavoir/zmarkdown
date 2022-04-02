"use strict";

/* Expose. */
module.exports = notes;

var defaultMacro = function defaultMacro(identifier, protect) {
  return "\\textsuperscript{".concat(protect ? '\\protect' : '', "\\footnotemark[").concat(identifier, "]}");
};

function notes(ctx, node) {
  var macro = ctx.footnoteReference || defaultMacro;
  var protect = Boolean(node.inHeading);
  return macro(node.identifier, protect);
}