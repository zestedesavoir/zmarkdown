const all = require('../all')
module.exports = function (ctx, node) {
  const displayedText = all(ctx, node)
  const signification = node.data.hProperties.title
  return ctx.abbr ? ctx.abbr(displayedText, signification) :
    `\\abbr{${displayedText}}{${signification}}`
}
