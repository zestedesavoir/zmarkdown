'use strict';

var all = require('../all');

module.exports = notes;

var defaultMacro = function defaultMacro(text, protect) {
  if (protect) {
    return '\\protect\\footnote{' + text + '}';
  }
  return '\\footnote{' + text + '}';
};

function notes(ctx, node, _index, parent) {
  var macro = ctx.footnote || defaultMacro;
  var protect = !!node.inHeading;

  return macro(all(ctx, node), protect);
}