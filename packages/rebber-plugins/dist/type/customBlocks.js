'use strict';

/* Dependencies. */
var all = require('rebber/dist/all');

/* Expose. */
module.exports = customBlock;

var defaultMacros = {
  defaultBlock: function defaultBlock(environmentName, blockTitle, blockContent) {
    return '\\begin{' + environmentName + '}' + (blockTitle ? '[' + blockTitle + ']' : '') + ('\n' + blockContent) + ('\n\\end{' + environmentName + '}\n');
  }
};

function customBlock(ctx, node) {
  var blockMacro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultBlock;

  var blockTitle = '';
  if (node.children && node.children.length) {
    if (node.children[0].type.endsWith('CustomBlockHeading')) {
      var titleNode = node.children.splice(0, 1)[0];
      blockTitle = all(ctx, titleNode).trim();
    }
  }

  node.children[0].type = 'paragraph';

  var blockContent = all(ctx, node).trim();
  var options = ctx.customBlocks || {};

  var environmentName = void 0;
  var type = node.type.replace('CustomBlock', '');

  if (options.map && options.map[type]) {
    environmentName = options.map[type];
  } else {
    environmentName = type[0].toUpperCase() + type.substring(1);
  }

  return blockMacro(environmentName, blockTitle, blockContent);
}