'use strict';

/* Expose. */
module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text, protect) {
  var footnote = '\\footnote[' + identifier + ']{\\label{footnote:' + identifier + '} ' + text + '}\n';
  if (protect) {
    return footnote + '\\protect';
  }
  return footnote;
};

/* Stringify a footnote `node`. */
function notes(ctx, node, _index, parent) {
  var macro = ctx.footnote || defaultMacro;
  var protect = !!node.inHeading;

  return macro(node.identifier, require('../all')(ctx, node).trim(), protect);
}