module.exports = plugin

function plugin (ctx = {}) {
  return function headingVisitor (node, index, parent) {
    if (node.type === 'footnote' && node.inHeading !== true) annotate(node)

    if (node.children) {
      node.children.map((n, i) => headingVisitor(n, i, node))
    }
  }
}

function annotate (node) {
  node.inHeading = true
}
