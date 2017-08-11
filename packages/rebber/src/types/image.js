/* Expose. */
module.exports = image

const defaultMacro = (node) => {
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
