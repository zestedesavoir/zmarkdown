const katexConstants = require('../../src/preprocessors/katexConstants.json')

const endOfCommandChars = ['\\', '[', ']', '{', '}', ' ', '(', ')', '\t', '\n']

const commandsThatDefineDelimiters = {
  left: ['[', '(', '{', '.'],
  right: [']', ')', '}', '.'],
}
function isEndOfCommand (nodeLine, index, currentIntendedCommand) {
  if (index >= nodeLine.length) {
    return true
  }
  // handle the case of \\
  const currentChar = nodeLine.charAt(index)
  if (currentChar === '\\' && currentIntendedCommand === '') {
    return false
  }
  return endOfCommandChars.indexOf(currentChar) !== -1

}

module.exports = () => node => {
  let commandStart = node.value.indexOf('\\')

  while (commandStart !== -1) {
    // Eat leading backslashes
    let leadSlashes = 1
    for (; node.value.charAt(commandStart + leadSlashes) === '\\'; leadSlashes++);

    // Find end of command
    let potentialEnd = leadSlashes + commandStart
    // the \\ command is special, just get rid of it
    if (leadSlashes === 2 && isEndOfCommand(node.value, potentialEnd, currentCommand)) {
      commandStart = node.value.indexOf('\\', potentialEnd)
      continue
    }
    let currentCommand = ''
    for (; !isEndOfCommand(node.value, potentialEnd, currentCommand); potentialEnd++) {
      currentCommand += node.value.charAt(potentialEnd)
    }
    const commandLength = currentCommand.length
    // Check for unknown commands
    if (!katexConstants.includes(`\\${currentCommand}`)) {
      const beforeCommand = node.value.substring(0, commandStart)
      const afterCommand = node.value.substring(commandStart + commandLength + 1, node.value.length)

      node.value = `${beforeCommand} ${afterCommand}`
    }

    commandStart = node.value.indexOf('\\', potentialEnd)
  }

  // Check count of brackets
  const openingBracesCount = (node.value.match(/(?<!\\){/g) || []).length
  const closingBracesCount = (node.value.match(/(?<!\\)}/g) || []).length
  const bracesDelta = closingBracesCount - openingBracesCount

  if (bracesDelta < 0) {
    node.value += '}'.repeat(-bracesDelta)
  } else if (bracesDelta > 0) {
    node.value = '{'.repeat(bracesDelta) + node.value
  }
}
