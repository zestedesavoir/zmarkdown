module.exports = split
import visit from 'unist-util-visit'

function split (tree, {splitDepth = 1,
  introductionAsProperty = true, conclusionAsProperty = false}) {
  if (splitDepth < 1) {
    throw new Error('splitDepth must be greater than 1')
  }
  const firstHeading = find(tree, {type: 'heading', depth: 1})
  if (!firstHeading) {
    throw new Error('No heading')
  }
  const splitter = new Splitter()
  visit(tree, null, (node, index, parent) => splitter.visit(node, index, parent))
  splitter.introduction = splitter.treeBefore.children
  if (conclusionAsProperty) {
    splitter.extractConclusions()
  }
  if (introductionAsProperty) {
    splitter.extractIntroductions()
  }
  return {
    introduction: splitter.introduction,
    trees: splitter.subTrees,
  }
}

function find (tree, {type = 'heading', depth = 1}) {
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
    this.treeBefore = {
      type: 'root',
      children: [],
    }
    this.subTrees = []
    this.depth = depth
    this._introduction = {}
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
      this.treeBefore.children.push(node)
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
