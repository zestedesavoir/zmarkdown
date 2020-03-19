"use strict";

module.exports = introduction;

var all = require('rebber/dist/all');

var introductionCommands = ['levelOneIntroduction', 'levelTwoIntroduction', 'levelThreeIntroduction'];

function introduction(ctx, node) {
  var commands = ctx.introductionCommands || introductionCommands;
  var command = commands[node.depth];
  return "\\begin{".concat(command, "}\n").concat(all(ctx, node), "\n\\end{").concat(command);
}