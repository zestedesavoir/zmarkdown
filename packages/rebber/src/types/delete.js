/* Dependencies. */
const all = require('../all')

/* Expose. */
module.exports = deleteNode

/* Stringify a delete `node`. */
function deleteNode (ctx, node, index, parent) {
  const contents = all(ctx, node)

  return `\\sout{${contents}}`
}
