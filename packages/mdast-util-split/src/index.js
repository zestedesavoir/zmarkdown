import visit from 'unist-util-visit'

const ROOT_HEADING_DEPTH = 1

module.exports = function split (tree, config) {
  const {
    splitDepth = ROOT_HEADING_DEPTH,
    conclusionAsProperty = false,
  } = config

  const firstHeading = find(tree, {type: 'heading', depth: ROOT_HEADING_DEPTH})
  if (!firstHeading) {
    throw new Error('No heading')
  }
  return splitAtDepth(
    tree,
    splitDepth, conclusionAsProperty
  )
}

function splitAtDepth (tree, currentDepth, conclusionAsProperty) {

  const splitter = new Splitter(currentDepth)
  visit(tree, null, (node, index, parent) => splitter.visit(node, index, parent))
  let conclusion = null
  if (conclusionAsProperty && splitter.subTrees.length > 1) {
    conclusion = splitter.subTrees.pop().children
  }
  return {
    introduction: splitter.introduction,
    trees: splitter.subTrees,
    conclusion: conclusion,
  }
}

function find (tree, {type = 'heading', depth = ROOT_HEADING_DEPTH}) {
  for (let i = 0; i < tree.children.length; i++) {
    if (tree.children[i].type === type && tree.children[i].depth === depth) {
      return tree.children[i]
    }
  }
  return null
}

function newRootTree (children = []) {
  return {
    type: 'root',
    children,
  }
}

class Splitter {
  constructor (depth = 1) {
    this.lastIndex = -1
    this.subTrees = []
    this.depth = depth
    this.introduction = newRootTree()
  }

  visit (node, index, parent) {
    // when we are at root
    if (!parent) {
      return
    }
    if ((node.type !== 'heading' || node.depth !== this.depth) &&
      parent.type === 'root' && this.lastIndex === -1) {
      this.introduction.children.push(node)
      return
    }
    if (node.type === 'heading' && node.depth === this.depth) {
      this.lastIndex = index
      const subtree = {
        title: newRootTree(node),
        children: newRootTree(),
      }
      this.subTrees.push(subtree)
    } else if (parent.type === 'root') {
      this.subTrees[this.subTrees.length - 1].children.children.push(node)
    }
  }
}
