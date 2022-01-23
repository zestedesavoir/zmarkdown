const katexConstants = require('../../src/preprocessors/katexConstants.json')

module.exports = () => node => {
  let commandStart = node.value.indexOf('\\')

  while (commandStart !== -1) {
    const commandEnd = node.value.substr(commandStart).search(/[{[\s]/)
    const commandName = node.value.substr(commandStart, commandEnd)

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
