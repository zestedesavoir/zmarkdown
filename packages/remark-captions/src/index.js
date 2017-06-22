const clone = require('clone')
const visit = require('unist-util-visit')
const xtend = require('xtend')

const legendBlock = {
  table: 'Table:',
  code: 'Code:'
}

const internLegendBlock = {
  blockquote: 'Source:',
  img: 'Figure:'
}

function plugin (opts) {
  const externalBlocks = xtend(legendBlock, (opts && opts.external) || {})
  const internalBlocks = xtend(internLegendBlock, (opts && opts.internal) || {})
  return transformer

  function transformer (tree) {
    Object.keys(internalBlocks).forEach((nodeType) =>
      visit(tree, nodeType, internLegendVisitor(internalBlocks)))

    Object.keys(externalBlocks).forEach(nodeType =>
      visit(tree, nodeType, externLegendVisitorCreator(externalBlocks)))
  }
}
function internLegendVisitor (internalBlocks) {
  return function (node, index, parent) {

    if (parent && parent.type === 'figure') return
    const lastP = getLast(node.children)
    if (!lastP || lastP.type !== 'paragraph') return
    const lastT = getLast(lastP.children)
    if (!lastT || lastT.type !== 'text') return

    const lines = lastT.value.split('\n')
    const lastLine = getLast(lines)
    if (!lastLine) return
    if (!lastLine.startsWith(internalBlocks[node.type])) return
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
}
function externLegendVisitorCreator (blocks) {
  return function (node, index, parent) {
    if (index + 1 < parent.children.length && parent.children[index + 1].type === 'paragraph') {
      const legendNode = parent.children[index + 1]
      const firstChild = legendNode.children[0]

      if (firstChild.value.startsWith(blocks[node.type])) {
        const firstLine = firstChild.value.split('\n')[0]
        const legendText = firstLine.replace(blocks[node.type], '').trim()
        const fullLegendLine = `${blocks[node.type]} ${legendText}`

        firstChild.value = firstChild.value.replace(fullLegendLine, '').trim()

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
        if (!firstChild.value) {
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
