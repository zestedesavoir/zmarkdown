/* Expose. */
module.exports = emphasis

/* Stringify an emphasis `node`. */
function emphasis (ctx, node, index, parent) {
  const contents = require('../all')(ctx, node)

  return `\\textit{${contents}}`
}
