module.exports = linkReference

const defaultMacro = (reference, inner) => `${inner}\\ref{${reference}}`

function linkReference (ctx, node) {
  const macro = ctx.linkReference ? ctx.linkReference : defaultMacro
  const innerText = require('../all')(ctx, node)

  if (!ctx.definitions(node.identifier)) return `[${innerText}]`
  return macro(node.identifier, innerText)
}
