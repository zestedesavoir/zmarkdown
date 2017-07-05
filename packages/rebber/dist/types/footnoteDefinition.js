'use strict';

var all = require('../all');
module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text) {
  return '\\footnote{\\label{' + identifier + '}' + text + '}\n';
};

function notes(ctx, node) {
  var macro = ctx.footnoteDefinition || defaultMacro;
  return macro(node.identifier, all(ctx, node).trim());
}