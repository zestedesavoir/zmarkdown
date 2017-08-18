/* Dependencies. */
const one = require('../one')

/* Expose. */
module.exports = root

/* Stringify a text `node`. */
function root (ctx, node, _, parent) {
  const values = []
  const children = node.children
  const length = children.length
  let index = -1
  let child
  let prev

  while (++index < length) {
    child = children[index]

    if (prev) {
      if (child.type === prev.type && prev.type === 'list') {
        values.push(prev.ordered === child.ordered ? '\n\n\n' : '\n\n')
      } else if (prev.type === 'list' && child.type === 'code' && !child.lang) {
        values.push('\n\n\n')
      } else {
        values.push('\n\n')
      }
    }

    values.push(one(ctx, child, index, node, node))

    prev = child
  }

  return values.join('')
}
