module.exports = notes

const defaultMacro = (identifier) => `\\label{${identifier}}`

function notes (ctx, node) {
  const macro = ctx.footnoteReference || defaultMacro
  return macro(node)
}
