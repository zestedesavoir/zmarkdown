"use strict";

module.exports = introduction;

var all = require('rebber/dist/all');

var introductionCommands = ['\\levelOneIntroduction', '\\levelTwoIntroduction', '\\levelThreeIntroduction'];

function introduction(ctx, node) {
  var commands = ctx.introductionCommands || introductionCommands;
  return "".concat(commands[node.depth], "{").concat(all(ctx, node), "}");
}