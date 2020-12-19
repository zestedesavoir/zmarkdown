const visit = require('unist-util-visit')

module.exports = processQuizzFactory
const clone = require('clone')
function processQuizzFactory (ctx) {
  const correctionTitle = ctx.correctionTitle || 'Correction'
  return function quizzCustomBlockVisitor (node, index, parent) {
    node.type = 'neutralCustomBlock'
    const correction = clone(node)
    correction.type = 'sCustomBlock'
    correction.children[0].children[0].value = correctionTitle
    parent.children.splice(index + 1, 0, correction)
    const bodyChildren = node.children[1].children
    while (bodyChildren.length > 0 &&
    bodyChildren[bodyChildren.length - 1].type !== 'listItem') {
      bodyChildren.splice(bodyChildren.length - 1, 1)
    }
    visit(node, 'listItem', (itemNode) => {
      itemNode.checked = null
    })
  }
}
