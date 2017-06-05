"use strict";

/* Expose. */
module.exports = paragraph;

/* Stringify a paragraph `node`.
 */
function paragraph(ctx, node) {
  var text = node.text;
  // console.log({node})

  return text;
}