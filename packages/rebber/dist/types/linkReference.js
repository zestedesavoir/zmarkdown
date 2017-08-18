'use strict';

// just a default one while I'm not sure what to do about all linkRef types
module.exports = linkReference;

var defaultMacro = function defaultMacro(reference, inner) {
  return inner + '\\ref{' + reference + '}';
};

function linkReference(ctx, node) {
  var macro = ctx.linkReference ? ctx.linkReference : defaultMacro;
  var innerText = require('../all')(ctx, node);
  return macro(node.identifier, innerText);
}