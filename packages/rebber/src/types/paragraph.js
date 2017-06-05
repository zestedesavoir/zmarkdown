const all = require('../all')

/* Expose. */
module.exports = paragraph

/* Stringify a paragraph `node`.
 */
function paragraph (ctx, node) {
  const contents = all(ctx, node)
  return `${contents}\n\n`
}
