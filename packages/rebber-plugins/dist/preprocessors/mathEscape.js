"use strict";

var katexConstants = require('../../src/preprocessors/katexConstants.json');

var endOfCommandChars = ['\\', '[', ']', '{', '}', ' ', '(', ')', '\t', '\n'];

function isEndOfCommand(nodeLine, index) {
  if (index >= nodeLine.length) {
    return true;
  }

  return endOfCommandChars.includes(nodeLine.charAt(index));
}

module.exports = function () {
  return function (node) {
    var commandStart = node.value.indexOf('\\');

    while (commandStart !== -1) {
      // Eat leading backslashes (at most two)
      var leadSlashes = 1;
      var isSlash = node.value.charAt(commandStart + leadSlashes) === '\\';

      while (isSlash && leadSlashes < 2) {
        isSlash = node.value.charAt(commandStart + leadSlashes) === '\\';
        leadSlashes++;
      }

      var currentCommand = ''; // Find end of command

      var potentialEnd = leadSlashes + commandStart;

      while (!isEndOfCommand(node.value, potentialEnd)) {
        currentCommand += node.value.charAt(potentialEnd);
        potentialEnd++;
      } // Check for unknown commands


      var slashedCommand = '\\'.repeat(leadSlashes).concat(currentCommand);
      var commandLength = slashedCommand.length;

      if (!katexConstants.includes(slashedCommand)) {
        var beforeCommand = node.value.substring(0, commandStart);
        var afterCommand = node.value.substring(commandStart + commandLength, node.value.length);
        node.value = "".concat(beforeCommand, " ").concat(afterCommand); // As we changed the command we need to restart from the beginning

        potentialEnd = 1;
      }

      commandStart = node.value.indexOf('\\', potentialEnd);
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