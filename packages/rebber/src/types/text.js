/* Dependencies. */
const xtend = require('xtend')
const entities = require('stringify-entities')

/* Expose. */
module.exports = text

/* Stringify a text `node`. */
function text (ctx, node, index, parent) {
  const value = node.value

  return isLiteral(parent) ? value : entities(value, xtend(ctx.entities, {
    subset: ['<', '&']
  }))
}

/* Check if content of `node` should be escaped. */
function isLiteral (node) {
  return node && (node.tagName === 'script' || node.tagName === 'style')
}
