'use strict';

module.exports = linkReference;

var defaultMacro = function defaultMacro(reference, inner) {
  return inner + '\\ref{' + reference + '}';
};

function linkReference(ctx, node) {
  var macro = ctx.linkReference ? ctx.linkReference : defaultMacro;
  var innerText = require('../all')(ctx, node);

  if (!ctx.definitions(node.identifier)) return '[' + innerText + ']';
  return macro(node.identifier, innerText);
}