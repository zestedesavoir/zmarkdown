const clone = require('clone')
const visit = require('unist-util-visit')

const legendBlock = {
  table: 'Table:',
  gridTable: 'Table:',
  code: 'Code:',
}

function plugin () {
  return transformer
}

function transformer (tree) {
  visit(tree, 'blockquote', visitor)
  Object.keys(legendBlock).forEach(nodeType => visit(tree, nodeType, externLegendVisitor))
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

function externLegendVisitor (node, index, parent) {
  if (index + 1 < parent.children.length && parent.children[index + 1].type === 'paragraph') {
    const legendNode = parent.children[index + 1]

    if (legendNode.children[0].value.startsWith(legendBlock[node.type])) {
      const figcaption = {
        type: 'figcaption',
        children: [{
          type: 'text',
          value: legendNode.children[0].value.replace(legendBlock[node.type], '').trim()
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
      parent.children.splice(index + 1, 1)
    }
  }
}

function getLast (xs) {
  const len = xs.length
  if (!len) return
  return xs[len - 1]
}

module.exports = plugin
