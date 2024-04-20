const visit = require('unist-util-visit')

function plugin ({labelPrefix = '', labelSuffix = ''} = {}) {
  function transformer (tree) {
    const footnotes = {}
    visit(tree, 'footnote', convert)

    visit(tree, 'footnoteDefinition', createIds(footnotes))

    visit(tree, 'footnoteReference', replaceIds(footnotes))
  }

  function createIds (footnotes) {
    return (node, index, parent) => {
      const identifier = node.identifier

      if (!footnotes.hasOwnProperty(identifier)) {
        footnotes[identifier] = Object.keys(footnotes).length + 1
      }
      node.identifier = String(footnotes[identifier])
      node.label = `${labelPrefix}${footnotes[identifier]}${labelSuffix}`
    }
  }

  function replaceIds (footnotes) {
    return (node, index, parent) => {
      const identifier = node.identifier

      if (!footnotes.hasOwnProperty(identifier)) {
        footnotes[identifier] = Object.keys(footnotes).length + 1
      }
      node.identifier = String(footnotes[identifier])
      node.label = `${labelPrefix}${footnotes[identifier]}${labelSuffix}`
    }
  }

  return transformer
}

function convert (node, index, parent) {
  const id = autoId(node.position.start)
  const footnoteDefinition = {
    type: 'footnoteDefinition',
    identifier: id,
    children: [{
      type: 'paragraph',
      children: node.children,
    }],
  }
  const footnoteReference = {
    type: 'footnoteReference',
    identifier: id,
  }
  parent.children.splice(index, 1, footnoteReference, footnoteDefinition)
}

function autoId (node) {
  const {line, column, offset} = node
  return `l${line}c${column}o${offset}`
}

module.exports = plugin
