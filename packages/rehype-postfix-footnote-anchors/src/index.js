const visit = require('unist-util-visit')

function plugin (postfix = '-postfix') {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!['li', 'sup'].includes(node.tagName)) return
      if (node.tagName === 'li') {
        if (!node.properties || !node.properties.id) return
        if (!node.properties.id.startsWith('fn-')) return
        let aTag

        if (!node.children.length) return
        if (node.children[node.children.length - 1].tagName === 'a') {
          aTag = node.children[node.children.length - 1]
        } else if (node.children[node.children.length - 2].tagName === 'p') {
          const pTag = node.children[node.children.length - 2]
          if (pTag.children[pTag.children.length - 1].tagName !== 'a') return
          aTag = pTag.children[pTag.children.length - 1]
        } else return

        if (!aTag.properties || !aTag.properties.className ||
            !aTag.properties.className.includes('footnote-backref')) return

        if (typeof postfix === 'function') {
          const id = node.properties.id
          node.properties.id = postfix(id)
          const link = aTag.properties.href
          aTag.properties.href = `#${postfix(link.substr(1))}`
        } else {
          node.properties.id += postfix
          aTag.properties.href += postfix
        }
      }

      if (node.tagName === 'sup') {
        if (!node.properties || !node.properties.id) return
        if (!node.properties.id.startsWith('fnref-')) return
        if (!node.children.length || node.children[0].tagName !== 'a') return

        const aTag = node.children[0]

        if (!aTag.properties || !aTag.properties.className ||
            !aTag.properties.className.includes('footnote-ref')) return

        if (typeof postfix === 'function') {
          const id = node.properties.id
          node.properties.id = postfix(id)
          const link = aTag.properties.href
          aTag.properties.href = `#${postfix(link.substr(1))}`
        } else {
          node.properties.id += postfix
          aTag.properties.href += postfix
        }
      }
    })
  }
}

module.exports = plugin
