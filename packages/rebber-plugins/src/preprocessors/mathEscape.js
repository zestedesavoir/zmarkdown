const katexConstants = require('../../src/preprocessors/katexConstants.json')

module.exports = () => node => {
  let commandStart = node.value.indexOf('\\')

  while (commandStart !== -1) {
    let commandEnd = node.value.substr(commandStart + 1).search(/[{[\s\\]/)

    // End not found is end of line
    if (commandEnd === -1) {
      commandEnd = node.value.length - 1
    }

    const commandName = node.value.substr(commandStart, commandEnd + 1)

    // Check for unknown commands
    if (!katexConstants.includes(commandName)) {
      node.value = node.value.replace(commandName, ' ')
    }

    commandStart = node.value.indexOf('\\', commandStart + 1)
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
