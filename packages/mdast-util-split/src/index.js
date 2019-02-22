module.exports = split
import visit from 'unist-util-visit'

const ROOT_HEADING_DEPTH = 1
function split (tree, {splitDepth = ROOT_HEADING_DEPTH,
  introductionAsProperty = true, conclusionAsProperty = false}) {
  const firstHeading = find(tree, {type: 'heading', depth: ROOT_HEADING_DEPTH})
  if (!firstHeading) {
    throw new Error('No heading')
  }
  return splitInDepth(tree, ROOT_HEADING_DEPTH, splitDepth, introductionAsProperty,
    conclusionAsProperty)
}

function splitInDepth (tree, depth, splitDepth = ROOT_HEADING_DEPTH,
  introductionAsProperty = true, conclusionAsProperty = false) {
  const splitter = new Splitter()
  splitter.depth = depth
  const hasHeading = !!find(tree, {type: 'heading', depth: depth})
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
  if (depth < splitDepth) {
    for (let i = 0; i < splitter.subTrees.length; i++) {
      const newTree = {
        type: 'root',
        children: splitter.subTrees[i].children.children,
      }
      const result = splitInDepth(newTree, depth + 1, splitDepth,
        introductionAsProperty, conclusionAsProperty)
      splitter.subTrees[i].children = result
    }
  }
  return {
    introduction: splitter.introduction,
    trees: splitter.subTrees,
  }
}

function find (tree, {type = 'heading', depth = ROOT_HEADING_DEPTH}) {
  for (let i = 0; i < tree.children.length; ++i) {
    if (tree.children[i].type === type && tree.children[i].depth === depth) {
      return tree.children[i]
    }
  }
  return null
}

class Splitter {
  constructor (depth = 1) {
    this.lastIndex = -1
    this.subTrees = []
    this.depth = depth
    this._introduction = {
      type: 'root',
      children: [],
    }
  }
  set introduction (nodes) {
    this._introduction = {type: 'root', children: nodes}
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
      for (let i = splittedPart.children.length - 1; i > 0; --i) {
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
      splittedPart.conclusion = {
        type: 'root',
        children: splittedPart.children.splice(lastIndex, splittedPart.children.length - lastIndex),
      }
    })
  }
  extractIntroductions () {
    const self = this
    this.subTrees.forEach(
      (subTree) => {
        const firstHeading = find(subTree.children, {
          type: 'heading',
          depth: self.depth + 1,
        })
        if (firstHeading) {
          subTree.introduction = {
            type: 'root',
            children: subTree.children.children.splice(0,
              subTree.children.children.indexOf(firstHeading)),
          }
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
        title: {
          type: 'root',
          children: [node],
        },
        children: {
          type: 'root',
          children: [],
        },
      }
      this.subTrees.push(subtree)
    } else if (parent.type === 'root') {
      this.subTrees[this.subTrees.length - 1].children.children.push(node)
    }
  }
}
