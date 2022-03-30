"use strict";

var katexConstants = require('../../src/preprocessors/katexConstants.json');

module.exports = function () {
  return function (node) {
    var commandStart = node.value.indexOf('\\');

    while (commandStart !== -1) {
      var commandEnd = node.value.substr(commandStart + 1).search(/[{[\s\\]/); // End not found is end of line

      if (commandEnd === -1) {
        commandEnd = node.value.length - 1;
      }

      var commandName = node.value.substr(commandStart, commandEnd + 1); // Check for unknown commands

      if (!katexConstants.includes(commandName)) {
        node.value = node.value.replace(commandName, ' ');
      }

      commandStart = node.value.indexOf('\\', commandStart + 1);
    } // Check count of brackets


    var openingBracesCount = (node.value.match(/(?<!\\){/g) || []).length;
    var closingBracesCount = (node.value.match(/(?<!\\)}/g) || []).length;
    var bracesDelta = closingBracesCount - openingBracesCount;

    if (bracesDelta < 0) {
      node.value += '}'.repeat(-bracesDelta);
    } else if (bracesDelta > 0) {
      node.value = '{'.repeat(bracesDelta) + node.value;
    }
  };
};