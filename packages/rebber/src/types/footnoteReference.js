module.exports = notes

const defaultMacro = (identifier) => `\\textsuperscript{\\ref{footnote:${identifier}}}`

function notes (ctx, node) {
  const macro = ctx.footnoteReference || defaultMacro
  return macro(node.identifier)
}
