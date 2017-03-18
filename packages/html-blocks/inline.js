const visit = require('unist-util-visit')

function plugin () {
  return transformer
}

function transformer (tree) {
  visit(tree, 'raw', visitor)
}

function visitor (node) {
  node.type = 'text'
  if (node.position.start.line !== node.position.end.line) {
    node.type = 'element'
    node.tagName = 'p'
    node.properties = {}
    node.children = [
      {
        type: 'text',
        value: node.value,
        position: node.position
      }
    ]
    node.value = undefined
    node.position = undefined
  }
}

module.exports = plugin
