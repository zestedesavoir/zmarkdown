/* Dependencies. */
const all = require('../all')

/* Expose. */
module.exports = customBlock

const defaultMacros = {
  secretCustomBlock: (innerText) => `\\addSecret{${innerText}}\n`,
  defaultBlock: (innerText, type) => {
    let customizedType = type.replace('CustomBlock', '')
    customizedType = customizedType[0].toUpperCase() + customizedType.substring(1)
    return `\\begin{${customizedType}}\n${innerText}\n\\end{${customizedType}}\n`
  }
}

function customBlock (ctx, node) {
  const blockMacro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultBlock
  const innerText = all(ctx, node).trim()
  return blockMacro(innerText, node.type)
}
