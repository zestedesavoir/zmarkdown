"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text, protect) {
  var footnote = "\\footnotetext[".concat(identifier, "]{\\label{footnote:").concat(identifier, "} ").concat(text, "}");

  if (protect) {
    return "".concat(footnote, "\\protect");
  }

  return footnote;
};

function notes(ctx, node) {
  var macro = ctx.footnoteDefinition || defaultMacro;
  var protect = !!node.inHeading;
  return macro(node.identifier, all(ctx, node, protect).trim());
}