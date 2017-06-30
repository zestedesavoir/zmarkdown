'use strict';

module.exports = notes;

var defaultMacro = function defaultMacro(identifier) {
  return '\\ref{' + identifier + '}';
};

function notes(ctx, node) {
  console.error('reference');
  var macro = ctx.footnoteReference || defaultMacro;
  return macro(node.identifier);
}