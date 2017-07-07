/* Dependencies. */
const all = require('../all')

/* Expose. */
module.exports = abbr

function abbr (ctx, node) {
  const displayedText = all(ctx, node)
  const signification = node.data.hProperties.title
  if (ctx.abbr && typeof ctx.abbr === 'function') {
    return ctx.abbr(displayedText, signification)
  }
  return `\\abbr{${displayedText}}{${signification}}`
}
