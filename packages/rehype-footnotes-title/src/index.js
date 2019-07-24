const visit = require('unist-util-visit')

function plugin (title = '') {
  function transformer (tree) {
    visit(tree, 'element', visitor)
  }

  function visitor (node, index, parent) {
    if (node.tagName === 'li' && node.properties.id) {
      let aTag

      if (!node.children || !node.children.length) return

      if (node.children[node.children.length - 1].tagName === 'a') {
        aTag = node.children[node.children.length - 1]
      } else if (node.children[node.children.length - 2].tagName === 'p') {
        const pTag = node.children[node.children.length - 2]
        if (pTag.children[pTag.children.length - 1].tagName !== 'a') return
        aTag = pTag.children[pTag.children.length - 1]
      } else return

      const identifier = node.properties.id.slice(3)
      const placeholderIndex = title.indexOf('$id')
      let thisTitle

      if (placeholderIndex !== -1) {
        thisTitle = title.split('')
        thisTitle.splice(placeholderIndex, 3, identifier)
        thisTitle = thisTitle.join('')
      }
      if (!thisTitle) thisTitle = identifier
      aTag.properties.title = thisTitle
    }
  }
  return transformer
}

module.exports = plugin
