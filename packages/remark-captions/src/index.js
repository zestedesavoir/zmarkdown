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

  return function transformer (tree) {
    Object.keys(internalBlocks).forEach((nodeType) =>
      visit(tree, nodeType, internLegendVisitor(internalBlocks)))

    Object.keys(externalBlocks).forEach(nodeType =>
      visit(tree, nodeType, externLegendVisitorCreator(externalBlocks)))
  }
}

function internLegendVisitor (internalBlocks) {
  return function (node, index, parent) {
    // if already wrapped in figure, skip
    if (parent && parent.type === 'figure') return

    // legend can only be in a paragraph
    const lastP = getLast(node.children)
    if (!lastP || lastP.type !== 'paragraph') return

    // find which child contains the last legend
    let legendChildIndex = -1
    lastP.children.forEach((child, index) => {
      if (child.type === 'text' &&
           (child.value.startsWith(internalBlocks[node.type]) ||
            child.value.includes(`\n${internalBlocks[node.type]}`))
      ) {
        legendChildIndex = index
      }
    })
    if (legendChildIndex === -1) return

    // split the text node containing the last legend and find the line containing it
    const potentialLegendLines = lastP.children[legendChildIndex].value.split('\n')
    let lastLegendIndex = -1
    potentialLegendLines.forEach((line, index) => {
      if (line.startsWith(internalBlocks[node.type])) {
        lastLegendIndex = index
      }
    })

    // the child containing the last legend is split in two: head contains text until
    // legend, tail contains legend text
    const tail = clone(lastP.children[legendChildIndex])
    const headText = potentialLegendLines.slice(0, lastLegendIndex).join('\n')
    // replace existing node 'head' content with text until legend
    lastP.children[legendChildIndex].value = headText

    // legend text is put into the cloned node…
    const legendText = potentialLegendLines
      .slice(lastLegendIndex)
      .join('\n')
      .slice(internalBlocks[node.type].length)
      .trimLeft()

    tail.value = legendText
    // … and 'tail', the cloned node is inserted after 'head'
    lastP.children.splice(legendChildIndex + 1, 0, tail)

    // gather all nodes that should be inside the legend
    const legendNodes = lastP.children.slice(legendChildIndex + 1)
    // remove them from the parent paragraph
    lastP.children = lastP.children.slice(0, legendChildIndex + 1)

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
  }
}

function externLegendVisitorCreator (blocks) {
  return function (node, index, parent) {
    if (index >= parent.children.length - 1) return
    if (parent.children[index + 1].type !== 'paragraph') return
    const legendNode = parent.children[index + 1]
    const firstChild = legendNode.children[0]
    if (firstChild.type !== 'text' || !firstChild.value.startsWith(blocks[node.type])) return

    const legendNodes = []
    const followingNodes = []
    const firstTextLine = firstChild.value.replace(blocks[node.type], '').split('\n')[0]
    if (firstChild.value.includes('\n')) {
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
        if (node.value.includes('\n')) {
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

function getLast (xs = []) {
  const len = xs.length
  if (!len) return
  return xs[len - 1]
}

module.exports = plugin
