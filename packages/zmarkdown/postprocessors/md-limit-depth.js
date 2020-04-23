const visit = require('unist-util-visit')

// get max depth of an element's children
function getDepth (node) {
  let maxDepth = 0

  if (node.children) {
    node.children.forEach(child => {
      const depth = getDepth(child)

      if (depth > maxDepth) {
        maxDepth = depth
      }
    })
  }

  return maxDepth + 1
}

module.exports = (maxDepth) => (tree, vfile) => {
  // limit AST depth to config.maxNesting
  visit(tree, 'root', (node) => {
    vfile.data.depth = getDepth(node) - 2
  })

  if (vfile.data.depth > maxDepth) {
    vfile.fail(`Markdown AST too complex: tree depth > ${maxDepth}`)
  }
}
