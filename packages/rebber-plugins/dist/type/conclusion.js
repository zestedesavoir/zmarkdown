"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = conclusion;
var conclusionMacros = [function (content) {
  return "\\begin{LevelOneConclusion}\n".concat(content, "\n\\end{LevelOneConclusion}");
}, function (content) {
  return "\\begin{LevelTwoConclusion}\n".concat(content, "\n\\end{LevelTwoConclusion}");
}, function (content) {
  return "\\begin{LevelThreeConclusion}\n".concat(content, "\n\\end{LevelThreeConclusion}");
}];
/* Stringify an conclusion `node`. */

function conclusion(ctx, node) {
  var level = node.data.level || 0;
  var macro = ctx[node.type] || conclusionMacros[level];
  var innerText = all(ctx, node);
  return "".concat(macro(innerText.trim()), "\n\n");
}