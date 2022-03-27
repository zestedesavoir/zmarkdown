"use strict";

module.exports = notes;

var defaultMacro = function defaultMacro(identifier) {
  return "\\textsuperscript{\\footnotemark[".concat(identifier, "]}");
};

function notes(ctx, node) {
  var macro = ctx.footnoteReference || defaultMacro;
  return macro(node.identifier);
}