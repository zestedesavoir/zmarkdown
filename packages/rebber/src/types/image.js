module.exports = image
const defaultInline = (node) => `\\inlineImage{${node.url}}`
const defaultMacro = (node) => {
  const width = node.width ? `[width=${node.width}]` : ''
  return `\\includeGraphics${width}{${node.url}}`
}
function image (ctx, node, _, parent) {
  let macro = ctx.image ? ctx.image : defaultMacro
  if (parent.type === 'paragraph' && parent.children.length - 1) {
    macro = ctx.inlineImage ? ctx.inlineImage : defaultInline
  }
  return macro(node)
}
