const visit = require('unist-util-visit')

const inline = ['p', 'kbd', 'del', 'sup']

function plugin () {
  return transformer
}

function transformer (tree) {
  visit(tree, 'raw', visitor)
}

function visitor (node, index, parent) {
  let replacement
  if (!parent) return

  if (!inline.includes(parent.tagName)) {
    replacement = {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [{
        type: 'text',
        value: node.value
      }]
    }
  } else {
    replacement = {
      type: 'text',
      value: node.value
    }
  }

  parent.children[index] = replacement
}

module.exports = plugin
