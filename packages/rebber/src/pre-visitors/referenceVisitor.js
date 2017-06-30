module.exports = plugin
const identifiers = {}
function plugin (ctx = {}) {
  return {
    definitionVisitor: definitionVisitor,
    imageReferenceVisitor: imageReferenceVisitor,
  }
  function definitionVisitor (node, index, parent) {
    let identifier = node.identifier
    while (Object.keys(identifiers).includes(identifier)) {
      identifier += '-1'
    }
    identifiers[identifier] = node.url
    node.identifier = identifier // force to remove doubly so that latex is compilable
    if (node.referenceType === 'shortcut') { // remark for abbr

      parent.children.splice(index, 1)
    }
  }

  function imageReferenceVisitor (node) {
    node.type = 'image'
    node.title = ''
    node.url = identifiers[node.identifier]

  }
}
