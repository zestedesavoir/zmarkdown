'use strict';

/* Dependencies. */
var all = require('../all');

/* Expose. */
module.exports = customBlock;

var defaultMacros = {
  secretCustomBlock: function secretCustomBlock(innerText) {
    return '\\addSecret{' + innerText + '}\n';
  },
  defaultBlock: function defaultBlock(innerText, type) {
    var customizedType = type.replace('CustomBlock', '');
    customizedType = customizedType[0].toUpperCase() + customizedType.substring(1);
    return '\\begin{' + customizedType + '}\n' + innerText + '\n\\end{' + customizedType + '}\n';
  }
};

function customBlock(ctx, node) {
  var blockMacro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultBlock;
  var innerText = all(ctx, node).trim();
  return blockMacro(innerText, node.type);
}