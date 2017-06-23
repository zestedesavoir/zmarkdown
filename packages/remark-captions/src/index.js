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
        const legendNodes = []
        const followingNodes = []
        const firstTextLine = firstChild.value.replace(blocks[node.type], '').split('\n')[0]
        if (firstChild.value.indexOf('\n') !== -1) {
          followingNodes.push({type: 'text',
            value: firstChild.value.replace(blocks[node.type], '').split('\n')[1]})
        }
        legendNodes.push({
          type: 'text',
          value: firstTextLine.trimLeft() // remove the " " after the {prefix}:
        })

        legendNode.children.forEach((node, index) => {
          if (index === 0) return
          if (node.type === 'text') {
            const keepInLegend = node.value.split('\n')[0]
            if (node.value.indexOf('\n') !== -1) {
              node.value = node.value.split('\n')[1]
              followingNodes.push(node)
            }
            legendNodes.push({type: 'text', value: keepInLegend})
          } else {
            legendNodes.push(clone(node))
          }
        })

        const figcaption = {
          type: 'figcaption',
          children: legendNodes,
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
        if (followingNodes.length) {
          parent.children.splice(index + 1, 1, {type: 'paragraph', children: followingNodes})
        } else {
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
