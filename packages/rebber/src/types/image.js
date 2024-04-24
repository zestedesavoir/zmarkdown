/* Dependencies. */
const path = require('path')

/* Expose. */
module.exports = image

const defaultInlineMatcher = (node, parent) => {
  return (parent.type === 'paragraph' && parent.children.length - 1) ||
    parent.type === 'heading'
}

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

  if (node.url) {
    // Avoid a security flaw: trying to escape image paths
    node.url = node.url.replace(/}/g, '')

    try {
      const { root, dir, base, ext, name } = path.parse(node.url)

      // \includegraphics crashes with filenames that contain more than one `.`,
      // the workaround is \includegraphics{/path/to/{image.foo}.jpg}
      if (base.includes('.')) {
        const safeName = name.includes('.')
          ? `{${name}}${ext}`
          : `${name}${ext}`

        node.url = `${path.format({ root, dir })}${safeName}`
      }
    } catch (e) {
      node.url = ''
    }
  }

  let macro = options.image ? options.image : defaultMacro
  const inlineMatcher = options.inlineMatcher ? options.inlineMatcher : defaultInlineMatcher

  if (inlineMatcher(node, parent)) {
    macro = options.inlineImage ? options.inlineImage : defaultInline
  }

  return macro(node)
}
