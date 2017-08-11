"use strict";

module.exports = notes;

var defaultMacro = function defaultMacro(identifier) {
  return "\\textsuperscript{\\ref{" + identifier + "}}";
};

function notes(ctx, node) {
  var macro = ctx.footnoteReference || defaultMacro;
  return macro(node.identifier);
}