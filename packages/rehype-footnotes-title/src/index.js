const visit = require('unist-util-visit-parents')

function plugin (title = '') {
  function transformer (tree) {
    visit(tree, 'element', visitor)
  }

  function visitor (node, parents) {
    if (
      node.tagName === 'a' &&
      node.properties.className &&
      node.properties.className.includes('footnote-backref') &&
      parents.length > 2 &&
      parents[parents.length - 2].tagName === 'li'
    ) {
      const parent = parents[parents.length - 2]
      const identifier = parent.properties.id.slice(3)
      const placeholderIndex = title.indexOf('$id')
      let thisTitle
      if (placeholderIndex !== -1) {
        thisTitle = title.split('')
        thisTitle.splice(placeholderIndex, 3, identifier)
        thisTitle = thisTitle.join('')
      }
      if (!thisTitle) thisTitle = identifier
      node.properties.title = thisTitle
    }
  }
  return transformer
}

module.exports = plugin
