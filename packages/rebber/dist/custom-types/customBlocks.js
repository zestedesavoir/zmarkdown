'use strict';

/* Dependencies. */
var all = require('../all');

/* Expose. */
module.exports = customBlock;

var defaultMacros = {
  defaultBlock: function defaultBlock(innerText, environmentName) {
    return '\\begin{' + environmentName + '}\n' + innerText + '\n\\end{' + environmentName + '}\n';
  }
};

function customBlock(ctx, node) {
  var blockMacro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultBlock;
  var innerText = all(ctx, node).trim();
  var options = ctx.customBlocks || {};

  var environmentName = void 0;
  var type = node.type.replace('CustomBlock', '');

  if (options.map && options.map[type]) {
    environmentName = options.map[type];
  } else {
    environmentName = type[0].toUpperCase() + type.substring(1);
  }

  return blockMacro(innerText, environmentName);
}