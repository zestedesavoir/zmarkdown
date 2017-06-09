const visit = require('unist-util-visit')

function plugin () {
  return transformer
}

function transformer (tree) {
  visit(tree, 'paragraph', visitor)
}

function visitor (node, index, parent) {
  if (parent.type === 'blockquote' && !parent.author) {
    const source = getSource(node)
    parent.author = source
    node.value.replace(source, '')
  }
}

function getSource(node) {
  const lines = node.value.split('\n')
  let i = 0
  for (; i < lines.length && !lines[i].startsWith('Source:'); i++);
  if (i < lines.length && lines[i].startsWith('Source:')) {
    return lines[i].split(':')[1]
  }
  return undefined
}

module.exports = plugin
