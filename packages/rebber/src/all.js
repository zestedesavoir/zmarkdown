/* Dependencies. */
const one = require('./one')

/* Expose. */
module.exports = all

/* Stringify all children of `parent`. */
function all (ctx, parent) {
  const children = parent && parent.children
  const length = children && children.length
  let index = -1
  const results = []

  while (++index < length) {
    results[index] = one(ctx, children[index], index, parent)
  }

  return results.join('')
}
