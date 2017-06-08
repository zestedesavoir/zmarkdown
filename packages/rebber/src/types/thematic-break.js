/* Expose. */
module.exports = thematicBreak

/* Stringify a delete `node`. */
function thematicBreak (ctx, node, index, parent) {
  return `\\horizontalLine\n\n`
}
