const visit = require('unist-util-visit')

function plugin (postfix = '-postfix') {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!['li', 'sup'].includes(node.tagName)) return
      if (node.tagName === 'li') {
        if (!node.properties || !node.properties.id) return
        if (!node.properties.id.startsWith('fn-')) return
        if (!node.children.length || node.children[node.children.length - 2].tagName !== 'a') return

        if (typeof postfix === 'function') {
          const id = node.properties.id
          node.properties.id = postfix(id)
          const link = node.children[node.children.length - 2].properties.href
          node.children[node.children.length - 2].properties.href = `#${postfix(link.substr(1))}`
        } else {
          node.properties.id += postfix
          node.children[node.children.length - 2].properties.href += postfix
        }
      }

      if (node.tagName === 'sup') {
        if (!node.properties || !node.properties.id) return
        if (!node.properties.id.startsWith('fnref-')) return
        if (!node.children.length || node.children[0].tagName !== 'a') return

        if (typeof postfix === 'function') {
          const id = node.properties.id
          node.properties.id = postfix(id)
          const link = node.children[0].properties.href
          node.children[0].properties.href = `#${postfix(link.substr(1))}`
        } else {
          node.properties.id += postfix
          node.children[0].properties.href += postfix
        }
      }
    })
  }
}

module.exports = plugin
