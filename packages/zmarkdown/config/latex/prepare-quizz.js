const visit = require('unist-util-visit')

module.exports = processQuizz
const clone = require('clone')
function processQuizz (correctionTitle = 'Correction') {
  return function quizzCustomBlockVisitor (node, index, parent) {
    node.type = 'neutralCustomBlock'
    const correction = clone(node)
    correction.type = 'sCustomBlock'
    correction.children[0].value = correctionTitle
    parent.children.splice(index + 1, 0, correction)
    while (node.children.length > 0 &&
    node.children[node.children.length - 1].type !== 'listItem') {
      node.children.splice(node.children.length - 1, 1)
    }
    visit(node, 'listItem', (itemNode) => {
      itemNode.checked = null
    })
  }
}
