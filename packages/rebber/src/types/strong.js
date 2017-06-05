/* Dependencies. */
const all = require('../all')

/* Expose. */
module.exports = strong

/* Stringify a strong `node`. */
function strong (ctx, node, index, parent) {
  const contents = all(ctx, node)

  return `\\textbf{${contents}}`
}
