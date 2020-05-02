const visit = require('unist-util-visit')

module.exports = () => (tree, vfile) => {
  visit(tree, 'element', node => {
    if (node.tagName !== 'div' ||
        !node.properties.className ||
        !node.properties.className.includes('hljs-code-div') ||
        node.children.length !== 2) {
      return
    }

    // This is fixed because we use a custom handler
    const lineNumberDiv = node.children[0]
    const codeBlock = node.children[1].children[0]

    // Get the lines to highlight relative to the first
    const hlLines = lineNumberDiv.children
      .reduce((acc, val, i) => {
        if ((val.properties && val.properties.className) === 'hll') {
          acc.push(i)
        }

        return acc
      }, [])
  })
}
