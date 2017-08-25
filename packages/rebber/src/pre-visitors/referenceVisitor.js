module.exports = plugin

function plugin (ctx = {}) {
  ctx.__identifiers = {}
  return {
    definitionVisitor: definitionVisitorFactory(ctx),
    imageReferenceVisitor: imageReferenceVisitorFactory(ctx),
  }
}

function definitionVisitorFactory (ctx) {
  return (node, index, parent) => {
    let identifier = node.identifier
    while (Object.keys(ctx.__identifiers).includes(identifier)) {
      identifier += '-1'
    }

    ctx.__identifiers[identifier] = node.url
    node.identifier = identifier // force to remove twice so that latex compiles

    if (node.referenceType === 'shortcut') { // remark for abbr
      parent.children.splice(index, 1)
    }
  }
}

function imageReferenceVisitorFactory (ctx) {
  return (node) => {
    node.type = 'image'
    node.title = ''
    node.url = ctx.__identifiers[node.identifier]
  }
}
