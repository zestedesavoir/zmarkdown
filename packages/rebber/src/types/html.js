// TODO: make it customizable
/* Expose. */
module.exports = html

/* Stringify a html `node`. */
function html (ctx, node, index, parent) {
  return node.value
}
