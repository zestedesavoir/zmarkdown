const xtend = require('xtend')
const visit = require('unist-util-visit')
const abbrPlugin = require('./abbr')()

const defaultVisitors = {
  'linkReference': [abbrPlugin().abbrVisitor],
  'text': [abbrPlugin().txtVisitor],
}

module.exports = preVisit

function preVisit (ctx, root) {
  const visitors = xtend(defaultVisitors, ctx.preprocessors || {})
  Object.keys(visitors).forEach((key) => {

    if (Array.isArray(visitors[key])) {
      visitors[key].forEach(visitor => visit(root, key, visitor))
    }
  })
}
