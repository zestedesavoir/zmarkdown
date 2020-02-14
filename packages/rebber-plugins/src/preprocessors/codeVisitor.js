const visit = require('unist-util-visit')
const {addIdentifier} = require('rebber/dist/preprocessors/referenceVisitors')()
const appendix = require('../type/appendix')

module.exports = (ctx, tree) => {
  ctx.overrides.appendix = appendix
  return (node) => {
    let appendix = tree.children[tree.children.length - 1]
    if (!appendix || appendix.type !== 'appendix') {
      appendix = {
        type: 'appendix',
        children: [],
      }
      tree.children.push(appendix)
    }
    let appendixIndex = appendix.children.length + 1
    visit(node, 'code', (innerNode, index, _parent) => {

      appendix.children.push({
        type: 'paragraph',
        children: [
          {
            type: 'definition',
            identifier: `appendix-${appendixIndex}`,
            url: `appendix ${appendixIndex}`,
            referenceType: 'full',
            children: [{type: 'text', value: 'code'}],
          },
          {type: 'text', value: '\n'},

        ],
      })
      appendix.children.push(innerNode)
      addIdentifier(`appendix-${appendixIndex}`, 'code')
      const referenceNode = {
        type: 'linkReference',
        identifier: `appendix-${appendixIndex}`,
        children: [
          {
            type: 'text',
            value: 'code',
          },
        ],
      }
      _parent.children.splice(index, 1, referenceNode)
      appendixIndex++
    })

  }
}
