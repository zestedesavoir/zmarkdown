const visit = require('unist-util-visit')

const containerDiv = (children) => ({
  type:       'element',
  tagName:    'div',
  properties: {className: ['hljs-code-div']},
  children,
})

const lineNumbersDiv = (children) => ({
  type:       'element',
  tagName:    'div',
  properties: {className: ['hljs-line-numbers']},
  children,
})

const lineNumber = {
  type:       'element',
  tagName:    'span',
  properties: {},
  children:   [],
}

const rehypeLineNumbers = () => (tree) => {
  visit(tree, 'element', (node, index, parent) => {
    const preNode = node
    const codeNode = preNode.children.length && node.children[0]

    if (!codeNode) return
    if (node.tagName !== 'pre' || codeNode.tagName !== 'code') return

    const sourceNode = codeNode.children.length && codeNode.children[0]
    const source = sourceNode.value

    const lines = source.split('\n').slice(0, -1)

    const columnNodes = [
      lineNumbersDiv(lines.map(() => lineNumber)),
      preNode,
    ]

    parent.children[index] = containerDiv(columnNodes)
  })
}

module.exports = rehypeLineNumbers
