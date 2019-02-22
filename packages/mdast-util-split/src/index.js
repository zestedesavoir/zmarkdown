import visit from 'unist-util-visit'

const ROOT_HEADING_DEPTH = 1

module.exports = function split (tree, config) {
  const {
    splitDepth = ROOT_HEADING_DEPTH,
    introductionAsProperty = true,
    conclusionAsProperty = false,
  } = config

  const firstHeading = find(tree, {type: 'heading', depth: ROOT_HEADING_DEPTH})
  if (!firstHeading) {
    throw new Error('No heading')
  }
  return splitAtDepth(
    tree,
    ROOT_HEADING_DEPTH,
    {splitDepth, introductionAsProperty, conclusionAsProperty}
  )
}

function splitAtDepth (tree, currentDepth, config) {
  const {
    splitDepth = ROOT_HEADING_DEPTH,
    introductionAsProperty = true,
    conclusionAsProperty = false,
  } = config

  const splitter = new Splitter(currentDepth)
  const hasHeading = !!find(tree, {type: 'heading', depth: currentDepth})
  if (!hasHeading) {
    return tree
  }
  visit(tree, null, (node, index, parent) => splitter.visit(node, index, parent))
  if (conclusionAsProperty) {
    splitter.extractConclusions()
  }
  if (introductionAsProperty) {
    splitter.extractIntroductions()
  }
  if (currentDepth < splitDepth) {
    for (let i = 0; i < splitter.subTrees.length; i++) {
      const newTree = newRootTree(splitter.subTrees[i].children.children)
      const result = splitAtDepth(newTree, currentDepth + 1, config)
      splitter.subTrees[i].children = result
    }
  }
  return {
    introduction: splitter.introduction,
    trees: splitter.subTrees,
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
    this._introduction = newRootTree()
  }
  set introduction (nodes) {
    this._introduction = newRootTree(nodes)
  }
  get introduction () {
    return this._introduction
  }
  extractConclusions () {
    this.subTrees.forEach(splittedPart => {
      const firstHeading = find(splittedPart.children, {
        type: 'heading',
        depth: this.depth + 1,
      })
      let lastHeading = null
      let lastIndex = 0
      for (let i = splittedPart.children.length - 1; i > 0; i--) {
        if (splittedPart.children[i] === 'heading' &&
          splittedPart.children[i].depth === this.depth - 1) {
          lastHeading = splittedPart.children[i]
          lastIndex = i
          break
        }
      }
      if (!lastHeading || lastHeading === firstHeading) {
        return
      }
      const rootContent = splittedPart.children.splice(
        lastIndex,
        splittedPart.children.length - lastIndex)
      splittedPart.conclusion = newRootTree(rootContent)
    })
  }
  extractIntroductions () {
    this.subTrees.forEach(
      (subTree) => {
        const firstHeading = find(subTree.children, {
          type: 'heading',
          depth: this.depth + 1,
        })
        if (firstHeading) {
          const rootContent = subTree.children.children.splice(
            0,
            subTree.children.children.indexOf(firstHeading))
          subTree.introduction = newRootTree(rootContent)
        }
      }
    )
  }

  visit (node, index, parent) {
    // when we are at root
    if (!parent) {
      return
    }
    if (node.type !== 'heading' && parent.type === 'root' && this.lastIndex === -1) {
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
