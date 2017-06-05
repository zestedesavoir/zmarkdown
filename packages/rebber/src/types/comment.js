/* Expose. */
module.exports = comment

/* Stringify a comment `node`. */
function comment (ctx, node) {
  return `\\begin{comment}
${node.value}
\\end{comment}`
}
