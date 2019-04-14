"use strict";

/* Expose. */
module.exports = br;

var defaultMacro = function defaultMacro() {
  return ' \\\\\n';
};
/* Stringify a break `node`. */


function br(ctx, node) {
  var macro = ctx["break"] ? ctx["break"] : defaultMacro;
  return macro(node);
}