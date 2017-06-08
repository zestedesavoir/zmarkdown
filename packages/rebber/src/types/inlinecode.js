/* Expose. */
module.exports = inlineCode

function inlineCode (ctx, node) {
  let i = 0
  let finalCode = ''
  const alphaNumPattern = /[a-z0-9]/
  for (;i < node.value.length; i++) {
    if (node.value[i] == '\\') {
      finalCode += '\\textbackslash'
      if (i < node.value.length - 1 && alphaNumPattern.match(node.value[i + 1])) {
        finalCode += ' '
      }
    } else {
      finalCode += node.value[i]
    }
  }
  return `\\verb\`${finalCode}\``
}
