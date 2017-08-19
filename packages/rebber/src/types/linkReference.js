// TODO @artragis - just a default one while I'm not sure what to do about all linkRef types
module.exports = linkReference

const defaultMacro = (reference, inner) => `${inner}\\ref{${reference}}`

function linkReference (ctx, node) {
  const macro = ctx.linkReference ? ctx.linkReference : defaultMacro
  const innerText = require('../all')(ctx, node)
  return macro(node.identifier, innerText)
}
