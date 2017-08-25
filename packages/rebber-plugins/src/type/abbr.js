/* Dependencies. */
const all = require('rebber/dist/all')

/* Expose. */
module.exports = abbr

function abbr (ctx, node) {
  const displayText = all(ctx, node)
  const meaning = node.data.hProperties.title
  if (ctx.abbr && typeof ctx.abbr === 'function') {
    return ctx.abbr(displayText, meaning)
  }
  return `\\abbr{${displayText}}{${meaning}}`
}
