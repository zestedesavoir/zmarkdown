const visit = require('unist-util-visit')

function plugin () {
  return transformer
}

function transformer (tree) {
  visit(tree, 'blockquote', visitor)
}

function visitor (node, index, parent) {
  const hasSource = node.children[node.children.length - 1].contains('Source:')
  if (!node.author && node.children && hasSource) {
    const source = getSource(node)
    node.author = source
    if (source) {
      node.type = 'figure'
      node.data.caption = source
    }
  }
}

function getSource (node) {
  const lines = node.children[node.children.length - 1].split('\n')
  let i = 0
  for (; i < lines.length && !lines[i].startsWith('Source:'); i++);
  if (i < lines.length && lines[i].startsWith('Source:')) {
    node.children[node.children.length - 1].replace(lines[i], '')
    return lines[i].split(':')[1]
  }
  return undefined
}

module.exports = plugin
