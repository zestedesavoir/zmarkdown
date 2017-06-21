const clone = require('clone')
const visit = require('unist-util-visit')
const xtend = require('xtend')

const legendBlock = {
  table: 'Table:',
  code: 'Code:',
}

function plugin (opts) {
  const blocks = xtend(legendBlock, opts || {})
  return transformer

  function transformer (tree) {
    visit(tree, 'blockquote', visitor)
    Object.keys(legendBlock).forEach(nodeType => visit(tree, nodeType,
      externLegendVisitorCreator(blocks)))
  }
}
function visitor (node, index, parent) {
  if (parent && parent.type === 'figure') return
  const lastP = getLast(node.children)
  if (!lastP || lastP.type !== 'paragraph') return
  const lastT = getLast(lastP.children)
  if (!lastT || lastT.type !== 'text') return

  const lines = lastT.value.split('\n')
  const lastLine = getLast(lines)
  if (!lastLine) return
  if (!lastLine.includes(':')) return
  const legend = lines.pop().slice(lastLine.indexOf(':') + 1).trim()

  lastT.value = lines.join('\n')

  const figcaption = {
    type: 'figcaption',
    children: [{
      type: 'text',
      value: legend,
    }],
    data: {
      hName: 'figcaption',
    },
  }

  const figure = {
    type: 'figure',
    children: [
      clone(node),
      figcaption,
    ],
    data: {
      hName: 'figure',
    },
  }

  node.type = figure.type
  node.children = figure.children
  node.data = figure.data
}
function externLegendVisitorCreator (blocks) {
  return externLegendVisitor
  function externLegendVisitor (node, index, parent) {
    if (index + 1 < parent.children.length && parent.children[index + 1].type === 'paragraph') {
      const legendNode = parent.children[index + 1]

      if (legendNode.children[0].value.startsWith(blocks[node.type])) {
        const legendText = legendNode.children[0].value
          .split('\n')[0].replace(blocks[node.type], '').trim()
        const fullLegendLine = `${blocks[node.type]} ${legendText}`
        legendNode.children[0].value = legendNode.children[0].value
          .replace(fullLegendLine, '').trim()
        const figcaption = {
          type: 'figcaption',
          children: [{
            type: 'text',
            value: legendText
          }],
          data: {
            hName: 'figcaption',
          },
        }
        const figure = {
          type: 'figure',
          children: [
            clone(node),
            figcaption,
          ],
          data: {
            hName: 'figure',
          },
        }
        node.type = figure.type
        node.children = figure.children
        node.data = figure.data
        if (!legendNode.children[0].value) {
          parent.children.splice(index + 1, 1)
        }
      }
    }
  }
}
function getLast (xs) {
  const len = xs.length
  if (!len) return
  return xs[len - 1]
}

module.exports = plugin
