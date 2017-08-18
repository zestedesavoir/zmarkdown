'use strict';

module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text) {
  return '\\footnotetext[' + identifier + ']{\\label{footnote:' + identifier + '} ' + text + '}\n';
};

function notes(ctx, node) {
  var macro = ctx.footnoteDefinition || defaultMacro;
  return macro(node.identifier, require('../all')(ctx, node).trim());
}