const all = require('../all')

module.exports = align

const defaultMacros = {
  CenterAligned: (innerText) => `\\begin{center}\n${innerText}\n\\end{center}`,
  RightAligned: (innerText) => `\\begin{flushright}\n${innerText}\n\\end{flushright}`,
  defaultType: (innerText, type) => `\\begin{${type}}\n${innerText}\n\\end{${type}}`,
}

function align (ctx, node) {
  const macro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultType
  const innerText = all(ctx, node)
  return macro(innerText, node.type)
}
