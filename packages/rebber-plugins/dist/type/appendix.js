"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');

var clone = require('clone');
/* Expose. */


module.exports = appendixPlugin;

function definitionMacro(ctx, identifier, url) {
  return "\\label{".concat(identifier, "}").concat(url);
}

function appendixPlugin(ctx, node) {
  if (node.children.length === 0) {
    return '';
  }

  var overriddenCtx = clone(ctx);
  overriddenCtx.definition = definitionMacro;
  var innerText = all(overriddenCtx, node);
  return "\\begin{appendices}\n".concat(innerText.trimEnd(), "\n\\end{appendices}");
}