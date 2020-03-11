"use strict";

module.exports = conclusion;

var all = require('rebber/dist/all');

var conclusionCommands = ['\\levelOneConclusion', '\\levelTwoConclusion', '\\levelThreeConclusion'];

function conclusion(ctx, node) {
  var commands = ctx.conclusionCommands || conclusionCommands;
  return "".concat(commands[node.depth], "{").concat(all(ctx, node), "}");
}