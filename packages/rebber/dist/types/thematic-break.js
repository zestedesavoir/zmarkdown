"use strict";

/* Expose. */
module.exports = thematicBreak;

var defaultMacro = function defaultMacro() {
  return '\\horizontalLine\n\n';
};
/* Stringify a delete `node`. */


function thematicBreak(ctx, node, index, parent) {
  var macro = ctx.thematicBreak || defaultMacro;
  return macro(node);
}