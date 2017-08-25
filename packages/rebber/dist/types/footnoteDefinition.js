'use strict';

module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text, protect) {
  var footnote = '\\footnotetext[' + identifier + ']{\\label{footnote:' + identifier + '} ' + text + '}';
  if (protect) {
    return footnote + '\\protect';
  }
  return footnote;
};

function notes(ctx, node) {
  var macro = ctx.footnoteDefinition || defaultMacro;
  var protect = !!node.inHeading;

  return macro(node.identifier, require('../all')(ctx, node, protect).trim());
}