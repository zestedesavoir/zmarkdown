const visit = require('unist-util-visit')

module.exports = () => (tree) => {
  // Find .footnotes > ol
  visit(tree, (node, _, parent) => {
    if (node.type === 'element' &&
      node.tagName === 'ol' &&
      parent.properties &&
      parent.properties.className &&
      parent.properties.className.includes('footnotes')
    ) {
      // Get all the footnotes
      const footnotes = node.children.filter(c => c.type === 'element' && c.tagName === 'li')

      // Reorder footnotes
      footnotes.sort((a, b) => {
        const aId = parseInt(a.properties.id.split('-')[1])
        const bId = parseInt(b.properties.id.split('-')[1])

        // We assume the two ids are never equals
        return aId > bId ? -1 : 1
      })

      // Interchange footnotes in HAST
      node.children.forEach((child, id) => {
        if (child.type === 'element' && child.tagName === 'li') {
          node.children[id] = footnotes.pop()
        }
      })
    }
  })
}
