"use strict";

module.exports = conclusion;

var all = require('rebber/dist/all');

var conclusionCommands = ['levelOneConclusion', 'levelTwoConclusion', 'levelThreeConclusion'];

function conclusion(ctx, node) {
  var commands = ctx.conclusionCommands || conclusionCommands;
  var command = commands[node.depth];
  return "\\begin{".concat(command, "}\n").concat(all(ctx, node), "\n\\end{").concat(command);
}