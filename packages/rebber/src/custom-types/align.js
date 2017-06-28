const all = require('../all')

module.exports = align

const defaultMacros = {
  CenterAligned: (innerText) => `\n\\begin{center}\n${innerText}\n\\end{center}\n`,
  RightAligned: (innerText) => `\n\\begin{flushright}\n${innerText}\n\\end{flushright}\n`,
  defaultType: (innerText, type) => `\n\\begin{${type}}\n${innerText}\n\\end{${type}}\n`,
}

function align (ctx, node) {
  const macro = ctx[node.type] || defaultMacros[node.type] || defaultMacros.defaultType
  const innerText = all(ctx, node)
  return macro(innerText, node.type)
}
