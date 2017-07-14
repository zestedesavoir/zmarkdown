const xtend = require('xtend')
const visit = require('unist-util-visit')

const codePlugin = require('./codeVisitor')
const headingPlugin = require('./headingVisitor')
const iframePlugin = require('./iframes')
const referencePlugin = require('./referenceVisitor')

module.exports = preVisit

function preVisit (ctx, root) {
  const defaultVisitors = {
    tableCell: [codePlugin(ctx, root).codeInTableVisitor],
    definition: [referencePlugin(ctx).definitionVisitor],
    imageReference: [referencePlugin(ctx).imageReferenceVisitor],
    heading: [headingPlugin(ctx)],
    iframe: [iframePlugin],
  }

  const visitors = xtend(defaultVisitors, ctx.preprocessors || {})

  Object.keys(visitors).forEach((key) => {
    if (Array.isArray(visitors[key])) {
      visitors[key].forEach(visitor => visit(root, key, visitor))
    }
  })
}
