/* Dependencies. */
const all = require('rebber/dist/all')

/* Expose. */
module.exports = customBlock

const defaultMacros = {
  defaultBlock: (innerText, environmentName) => {
    return `\\begin{${environmentName}}\n${innerText}\n\\end{${environmentName}}\n`
  }
}

function customBlock (ctx, node) {
  const blockMacro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultBlock
  const innerText = all(ctx, node).trim()
  const options = ctx.customBlocks || {}

  let environmentName
  const type = node.type.replace('CustomBlock', '')

  if (options.map && options.map[type]) {
    environmentName = options.map[type]
  } else {
    environmentName = type[0].toUpperCase() + type.substring(1)
  }

  return blockMacro(innerText, environmentName)
}
