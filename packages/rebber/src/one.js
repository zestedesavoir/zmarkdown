/* Dependencies. */
const has = require('has')
const xtend = require('xtend')

/* Expose. */
module.exports = one

/* Handlers. */
const handlers = {}

handlers.root = require('./all')
handlers.heading = require('./types/heading')
handlers.paragraph = require('./types/paragraph')
handlers.comment = require('./types/comment')

handlers.blockquote = require('./types/blockquote')
handlers.break = require('./types/break')
handlers.code = require('./types/code')
handlers.definition = require('./types/definition')
handlers.delete = require('./types/delete')
handlers.emphasis = require('./types/emphasis')
handlers.footnote = require('./types/footnote')
handlers.footnoteDefinition = require('./types/footnoteDefinition')
handlers.footnoteReference = require('./types/footnoteReference')
handlers.html = require('./types/html')
handlers.image = require('./types/image')
handlers.inlineCode = require('./types/inlinecode')
handlers.link = require('./types/link')
handlers.linkReference = require('./types/linkReference')
handlers.list = require('./types/list')
handlers.listItem = require('./types/listItem')
handlers.strong = require('./types/strong')
handlers.table = require('./types/table')
handlers.tableCell = require('./types/tableCell')
handlers.tableHeader = require('./types/tableHeader')
handlers.tableRow = require('./types/tableRow')
handlers.text = require('./types/text')
handlers.thematicBreak = require('./types/thematic-break')
handlers.root = require('./types/root')

/* Stringify `node`. */
function one (ctx, node, index, parent, root) {
  const handlersOverride = has(ctx, 'override') ? ctx.override : {}
  const h = xtend(handlers, handlersOverride)

  const type = node && node.type

  if (!type) {
    throw new Error(`Expected node, not \`${node}\``)
  }

  if (!(has(h, type) && typeof h[type] === 'function')) {
    throw new Error(`Cannot compile unknown node \`${type}\``)
  }

  return h[type](ctx, node, index, parent, root)
}
