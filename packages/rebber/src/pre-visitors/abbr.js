const all = require('../all')
module.exports = plugin
const identifiers = {}
function plugin (ctx = {}) {
  return {
    abbrVisitor: abbrVisitor,
    txtVisitor: txtVisitor
  }
  function abbrVisitor (node, index, parent) {
    if (node.referenceType === 'shortcut') { // remark for abbr
      identifiers[node.identifier] = all(ctx, node)
      parent.children.splice(index, 1)
    }
  }
  function txtVisitor (node) {
    Object.keys(identifiers).forEach(function (identifier) {
      node.value = node.value
        .replace(identifier, `\\abbr{${identifier}{${identifiers[identifier]}}`)
    })
  }
}
