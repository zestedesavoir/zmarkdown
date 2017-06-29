const xtend = require('xtend')
const visit = require('unist-util-visit')
const referencePlugin = require('./referenceVisitor')
const abbrPlugin = require('./abbrVisitor')

module.exports = preVisit

function preVisit (ctx, root) {
  const defaultVisitors = {
    'definition': [referencePlugin(ctx).definitionVisitor],
    'abbr': [abbrPlugin(ctx).abbrVisitor],
    'imageReference': [referencePlugin(ctx).imageReferenceVisitor],
    'text': [abbrPlugin(ctx).textVisitor]
  }
  const visitors = xtend(defaultVisitors, ctx.preprocessors || {})
  Object.keys(visitors).forEach((key) => {

    if (Array.isArray(visitors[key])) {
      visitors[key].forEach(visitor => visit(root, key, visitor))
    }
  })
}
