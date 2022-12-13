"use strict";

var katexConstants = require('../../src/preprocessors/katexConstants.json');

var endOfCommandChars = ['\\', '[', ']', '{', '}', ' ', '(', ')', '\t', '\n'];

function isEndOfCommand(nodeLine, index, currentIntendedCommand) {
  if (index >= nodeLine.length) {
    return true;
  } // handle the case of \\


  var currentChar = nodeLine.charAt(index);

  if (currentChar === '\\' && currentIntendedCommand === '') {
    return false;
  }

  return endOfCommandChars.indexOf(currentChar) !== -1;
}

module.exports = function () {
  return function (node) {
    var commandStart = node.value.indexOf('\\');

    while (commandStart !== -1) {
      // Eat leading backslashes
      var leadSlashes = 1;

      for (; node.value.charAt(commandStart + leadSlashes) === '\\'; leadSlashes++) {
        ;
      }

      var currentCommand = ''; // Find end of command

      var potentialEnd = leadSlashes + commandStart; // the \\ command is special, just get rid of it

      if (leadSlashes === 2 && isEndOfCommand(node.value, potentialEnd, currentCommand)) {
        commandStart = node.value.indexOf('\\', potentialEnd);
        continue;
      }

      for (; !isEndOfCommand(node.value, potentialEnd, currentCommand); potentialEnd++) {
        currentCommand += node.value.charAt(potentialEnd);
      }

      var commandLength = currentCommand.length; // Check for unknown commands

      if (!katexConstants.includes("\\".concat(currentCommand))) {
        var beforeCommand = node.value.substring(0, commandStart);
        var afterCommand = node.value.substring(commandStart + commandLength + 1, node.value.length);
        node.value = "".concat(beforeCommand, " ").concat(afterCommand); // as we changed the command we need to restart from the very start

        potentialEnd = 1;
      }

      commandStart = node.value.indexOf('\\', potentialEnd - 1);
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