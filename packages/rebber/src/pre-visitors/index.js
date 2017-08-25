const xtend = require('xtend')
const visit = require('unist-util-visit')

const codePlugin = require('./codeVisitor')
const headingPlugin = require('./headingVisitor')
const referencePlugin = require('./referenceVisitor')

module.exports = preVisit

function preVisit (ctx, tree) {
  const defaultVisitors = {
    tableCell: [codePlugin(ctx, tree).codeInTableVisitor],
    definition: [referencePlugin(ctx).definitionVisitor],
    imageReference: [referencePlugin(ctx).imageReferenceVisitor],
    heading: [headingPlugin(ctx)],
  }

  const visitors = xtend(defaultVisitors, ctx.preprocessors || {})

  Object.keys(visitors).forEach((nodeType) => {
    if (Array.isArray(visitors[nodeType])) {
      visitors[nodeType].forEach(visitor => visit(tree, nodeType, visitor))
    }
  })
}
