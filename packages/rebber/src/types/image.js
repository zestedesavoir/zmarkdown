/* Expose. */
module.exports = image

const defaultMacro = (node) => {
  /*
  Note that MDAST `Image` nodes don't have a `width` property.
  You might still want to specify a width since \includegraphics handles it.
  */
  const width = node.width ? `[width=${node.width}]` : ''
  return `\\includegraphics${width}{${node.url}}`
}

const defaultInline = defaultMacro

function image (ctx, node, _, parent) {
  const options = ctx.image || {}

  let macro = options.image ? options.image : defaultMacro
  if (parent.type === 'paragraph' && parent.children.length - 1) {
    macro = options.inlineImage ? options.inlineImage : defaultInline
  }

  return macro(node)
}
