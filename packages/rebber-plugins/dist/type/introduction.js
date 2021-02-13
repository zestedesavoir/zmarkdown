"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = introduction;
var introductionMacros = [function (content) {
  return "\\begin{LevelOneIntroduction}\n".concat(content, "\n\\end{LevelOneIntroduction}");
}, function (content) {
  return "\\begin{LevelTwoIntroduction}\n".concat(content, "\n\\end{LevelTwoIntroduction}");
}, function (content) {
  return "\\begin{LevelThreeIntroduction}\n".concat(content, "\n\\end{LevelThreeIntroduction}");
}];
/* Stringify an introduction `node`. */

function introduction(ctx, node) {
  var level = node.data.level || 0;
  var macro = ctx[node.type] || introductionMacros[level];
  var innerText = all(ctx, node);
  return "".concat(macro(innerText.trim()), "\n\n");
}