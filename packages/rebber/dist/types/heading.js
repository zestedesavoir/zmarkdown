"use strict";

/* Expose. */
module.exports = heading;
var defaultHeadings = [function (val) {
  return "\\part{".concat(val, "}\n");
}, function (val) {
  return "\\chapter{".concat(val, "}\n");
}, function (val) {
  return "\\section{".concat(val, "}\n");
}, function (val) {
  return "\\subsection{".concat(val, "}\n");
}, function (val) {
  return "\\subsubsection{".concat(val, "}\n");
}, function (val) {
  return "\\paragraph{".concat(val, "}\n");
}, function (val) {
  return "\\subparagaph{".concat(val, "}\n");
}];
/* Stringify a heading `node`.
 */

function heading(ctx, node) {
  var depth = node.depth;

  var content = require('../all')(ctx, node);

  var headings = ctx.headings || defaultHeadings;
  var fn = headings[node.depth - 1];

  if (typeof fn !== 'function') {
    throw new Error("Cannot compile heading of depth ".concat(depth, ": not a function"));
  }

  return fn(content);
}