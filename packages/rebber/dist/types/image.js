'use strict';

module.exports = image;
var defaultInline = function defaultInline(node) {
  return '\\inlineImage{' + node.url + '}';
};
var defaultMacro = function defaultMacro(node) {
  var width = node.width ? '[width=' + node.width + ']' : '';
  return '\\includeGraphics' + width + '{' + node.url + '}';
};
function image(ctx, node, _, parent) {
  var macro = ctx.image ? ctx.image : defaultMacro;
  if (parent.type === 'paragraph' && parent.children.length - 1) {
    macro = ctx.inlineImage ? ctx.inlineImage : defaultInline;
  }
  return macro(node);
}