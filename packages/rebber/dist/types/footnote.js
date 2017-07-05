'use strict';

var all = require('../all');
module.exports = notes;

var defaultMacro = function defaultMacro(text, isHeading) {
  if (isHeading) {
    return '\\protect\\footnote{' + text + '}';
  }
  return '\\footnote{' + text + '}';
};

function notes(ctx, node, _, parent) {
  var macro = ctx.footnote || defaultMacro;
  return macro(all(ctx, node), parent.type === 'heading');
}