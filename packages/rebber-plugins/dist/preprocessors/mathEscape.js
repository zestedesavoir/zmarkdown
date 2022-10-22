"use strict";

var katexConstants = require('../../src/preprocessors/katexConstants.json');

module.exports = function () {
  return function (node) {
    var commandStart = node.value.indexOf('\\');

    while (commandStart !== -1) {
      // Eat leading backslashes
      var leadSlashes = 1;

      for (; node.value.charAt(commandStart + leadSlashes) === '\\'; leadSlashes++) {
        ;
      } // Find end of command


      var potentialEnd = node.value.substr(commandStart + leadSlashes).search(/[{[\s\\]/); // Is end was not found, use end of line

      var commandLength = potentialEnd === -1 ? node.value.length : leadSlashes + potentialEnd;
      var commandName = node.value.substr(commandStart, commandLength); // Check for unknown commands

      if (!katexConstants.includes(commandName)) {
        var beforeCommand = node.value.substring(0, commandStart);
        var afterCommand = node.value.substring(commandStart + commandLength, node.value.length);
        node.value = "".concat(beforeCommand, " ").concat(afterCommand);
      }

      commandStart = node.value.indexOf('\\', commandStart + leadSlashes);
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