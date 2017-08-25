const visit = require('unist-util-visit')

module.exports = (ctx, tree) => {
  const title = ctx.codeAppendiceTitle || 'Appendices'
  return (node) => {
    const inAppendix = []
    let appendixIndex = 1

    visit(node, 'code', (innerNode, index, _parent) => {
      inAppendix.push({
        type: 'paragraph',
        children: [
          {
            type: 'definition',
            identifier: `appendix-${appendixIndex}`,
            referenceType: 'full',
            children: [{type: 'text', value: 'code'}]
          },
          {type: 'text', value: '\n'},
          innerNode
        ]
      })
      const referenceNode = {
        type: 'linkReference',
        identifier: `appendix-${appendixIndex}`
      }
      _parent.children.splice(index, 1, referenceNode)
      appendixIndex++
    })

    if (inAppendix.length) {
      tree.children.push({
        type: 'heading',
        depth: 1,
        children: [{type: 'text', value: title}]

      })
      inAppendix.forEach((element) => tree.children.push(element))
    }
  }
}
