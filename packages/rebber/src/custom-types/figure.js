/* Dependencies. */
const all = require('../all')
const has = require('has')

/* Expose. */
module.exports = figure

const defaultMacros = {
  blockquote: (innerText, caption = 'Anonymous') =>
    `\\begin{Quotation}{${caption}}\n${innerText}\n\\end{Quotation}\n\n`,
  code: (innerText, caption, extra) => {
    let params = `[${caption}]`
    if (extra.lines) {
      params += `[${extra.lines}]`
    }
    return `\\begin{codeBlock}${params}{${extra.language}}
            \n${innerText}\n\\end{codeBlock}\n\n`
  }
}

const makeExtra = {
  blockquote: node => {},
  code: node => { return {language: node.lang, lines: node.hightlighted || ''} }
}

/* Stringify a Figure `node`. */
function figure (ctx, node) {
  const type = node.children[0].type
  const macro = (has(ctx, 'figure') && has(ctx.figure, type) && ctx.figure[type]) ||
    (has(defaultMacros, type) && defaultMacros[type])
  if (!macro) return

  let caption = ''
  if (node.children.length) {
    caption = node.children
      .filter(node => node.type === 'figcaption')
      .map(node => all(ctx, node))
      .join('')
  }

  node.children = node.children.filter(node => node.type !== 'figcaption')
  if (node.children.length === 1) {
    node.children = node.children[0].children
  }
  const innerText = all(ctx, node)
  return macro(innerText.trim(), caption, makeExtra[type](node))
}
