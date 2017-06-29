const identifiers = {}
module.exports = plugin
function plugin (ctx = {}) {
  return {
    txtVisitor: txtVisitor,
    abbrVisitor: abbrVisitor
  }
  function abbrVisitor (node, index, parent) {
    const identifier = node.data.word
    const desc = node.data.desc
    identifiers[identifier] = desc
    parent.children.splice(index, 1) // remove the definition
  }
  function txtVisitor (node) {
    Object.keys(identifiers).forEach(function (identifier) {
      node.value = node.value
        .replace(identifier, `\\abbr{${identifier}{${identifiers[identifier]}}`)
    })
  }
}
