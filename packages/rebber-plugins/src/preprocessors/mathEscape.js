const katexConstants = require('../../src/preprocessors/katexConstants.json')

module.exports = () => node => {
  let commandStart = node.value.indexOf('\\')

  while (commandStart !== -1) {
    // Eat leading backslashes
    let leadSlashes = 1
    for (; node.value.charAt(commandStart + leadSlashes) === '\\'; leadSlashes++);

    // Find end of command
    const potentialEnd = node.value.substr(commandStart + leadSlashes).search(/[{[\s\\]/)

    // Is end was not found, use end of line
    const commandLength = potentialEnd === -1 ? node.value.length : leadSlashes + potentialEnd

    const commandName = node.value.substr(commandStart, commandLength)

    // Check for unknown commands
    if (!katexConstants.includes(commandName)) {
      const beforeCommand = node.value.substring(0, commandStart)
      const afterCommand = node.value.substring(commandStart + commandLength, node.value.length)

      node.value = `${beforeCommand} ${afterCommand}`
    }

    commandStart = node.value.indexOf('\\', commandStart + leadSlashes)
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
