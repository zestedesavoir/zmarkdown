"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = align;
var defaultMacros = {
  leftAligned: function leftAligned(innerText) {
    return "\n\n".concat(innerText, "\n\n");
  },
  centerAligned: function centerAligned(innerText) {
    return "\n{\\centering ".concat(innerText, "}\n");
  },
  rightAligned: function rightAligned(innerText) {
    return "\n{\\raggedleft\n".concat(innerText, "}\n");
  },
  defaultType: function defaultType(innerText, type) {
    return "\n\\begin{".concat(type, "}\n").concat(innerText, "\n\\end{").concat(type, "}\n");
  }
};

function align(ctx, node) {
  var macro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultType;
  var innerText = all(ctx, node);
  return macro(innerText, node.type);
}