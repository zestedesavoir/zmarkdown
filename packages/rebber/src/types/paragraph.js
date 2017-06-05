/* Expose. */
module.exports = paragraph

/* Stringify a paragraph `node`.
 */
function paragraph (ctx, node) {
  const text = node.text
  // console.log({node})

  return text
}
