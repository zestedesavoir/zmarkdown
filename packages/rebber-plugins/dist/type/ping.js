"use strict";

/* Expose. */
module.exports = ping;
/* Stringify a `ping` node. */

function ping(_, node) {
  console.log(node)
  return "\\ping{".concat(node.username, "}");
}
