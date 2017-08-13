const visit = require('unist-util-visit')

module.exports = plugin

const defaultLanguage = 'text'

const appendiceVisitorFactory = ({title, root}) => (node) => {
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
    root.children.push({
      type: 'heading',
      depth: 1,
      children: [{type: 'text', value: title}]

    })
    inAppendix.forEach((element) => root.children.push(element))
  }
}

const forceDefaultLanguageVisitor = (selectedDefaultLanguage) => (node) => {
  node.lang = node.lang || selectedDefaultLanguage
}

function plugin (ctx, root) {
  const title = ctx.codeAppendiceTitle || 'Appendices'
  return {
    codeInTableVisitor: appendiceVisitorFactory({title, root}),
    forceDefaultLanguageVisitor: forceDefaultLanguageVisitor(ctx.defaultLanguage || defaultLanguage)
  }
}
