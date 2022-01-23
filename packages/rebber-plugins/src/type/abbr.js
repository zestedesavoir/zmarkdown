/* Dependencies. */
const all = require('rebber/dist/all')
const escape = require('rebber/dist/escaper')

/* Expose. */
module.exports = abbrPlugin

function abbrPlugin (ctx, node) {
  const abbr = all(ctx, node)
  const reference = escape(node.reference)

  if (ctx.abbr && typeof ctx.abbr === 'function') {
    return ctx.abbr(abbr, reference)
  }

  return `\\abbr{${abbr}}{${reference}}`
}
