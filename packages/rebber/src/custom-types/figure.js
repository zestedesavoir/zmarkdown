/* Dependencies. */
const all = require('../all')
const one = require('../one')
const has = require('has')

/* Expose. */
module.exports = figure

const defaultMacros = {
  blockquote: (innerText, caption = 'Anonymous') =>
    `\\begin{Quotation}{${caption}}\n${innerText}\n\\end{Quotation}\n\n`,
  code: (code, caption, extra) => {
    let params = `[${caption}]`
    if (extra.lines) {
      params += `[${extra.lines}]`
    }
    return `\\begin{codeBlock}${params}{${extra.language}}` +
            `\n${code}\n\\end{codeBlock}\n\n`
  },
  table: (innerText) => innerText,
  image: (_, caption, extra) => {
    const width = extra.width ? `[${extra.width}]` : ''

    return `\\begin{center}
    \\includegraphics${width}{${extra.url}}\n\\captionof{${caption}}\n\\end{center}`
  }
}

const makeExtra = {
  blockquote: node => {},
  code: node => {
    const extra = {language: node.lang.split(' ')[0]}
    if (node.lang.includes(' ')) {
      const tail = node.lang.split(' ')[1]
      if (tail) {
        extra.lines = tail.replace('hl_lines=', '').trim()
      }
    }
    return extra
  },
  image: node => {
    node.witdth = '\\linewidth'
    return node
  }
}

/* Stringify a Figure `node`. */
function figure (ctx, node, index, parent) {
  const type = node.children[0].type
  const macro = (has(ctx, 'figure') && has(ctx.figure, type) && ctx.figure[type]) ||
    (has(defaultMacros, type) && defaultMacros[type])

  let caption = ''
  if (node.children.length) {
    caption = node.children
      .filter(captionNode => captionNode.type === 'figcaption')
      .map(captionNode => all(ctx, captionNode))
      .join('')
  }

  node.caption = caption // allows to add caption to the default processing
  if (!macro) {
    node.children[0].caption = caption
    return one(ctx, node.children[0], 0, node)
  }
  node.children = node.children.filter(node => node.type !== 'figcaption')
  if (node.children.length === 1) {
    node.children = node.children[0].children
  }
  const extra = has(makeExtra, type) ? makeExtra[type](node) : undefined
  const innerText = all(ctx, node) || node.value || ''
  return macro(innerText.trim(), caption, extra)
}
