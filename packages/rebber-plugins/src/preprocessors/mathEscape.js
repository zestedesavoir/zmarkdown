const katexConstants = require('../../src/preprocessors/katexConstants.json')

const endOfCommandChars = ['\\', '[', ']', '{', '}', ' ', '(', ')', '\t', '\n']

function isEndOfCommand (nodeLine, index) {
  if (index >= nodeLine.length) {
    return true
  }

  return endOfCommandChars.includes(nodeLine.charAt(index))
}

module.exports = () => node => {
  let commandStart = node.value.indexOf('\\')

  while (commandStart !== -1) {
    // Eat leading backslashes (at most two)
    let leadSlashes = 1
    let isSlash = (node.value.charAt(commandStart + leadSlashes) === '\\')

    while (isSlash && leadSlashes < 2) {
      isSlash = (node.value.charAt(commandStart + leadSlashes) === '\\')
      leadSlashes++
    }

    let currentCommand = ''
    // Find end of command
    let potentialEnd = leadSlashes + commandStart

    while (!isEndOfCommand(node.value, potentialEnd)) {
      currentCommand += node.value.charAt(potentialEnd)
      potentialEnd++
    }

    // Check for unknown commands
    const slashedCommand = '\\'.repeat(leadSlashes).concat(currentCommand)
    const commandLength = slashedCommand.length

    if (!katexConstants.includes(slashedCommand)) {
      const beforeCommand = node.value.substring(0, commandStart)
      const afterCommand = node.value.substring(commandStart + commandLength, node.value.length)

      node.value = `${beforeCommand} ${afterCommand}`
      // As we changed the command we need to restart from the beginning
      potentialEnd = 1
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
