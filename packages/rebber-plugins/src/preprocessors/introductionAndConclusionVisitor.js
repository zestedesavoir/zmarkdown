const splitAtDepth = require('mdast-util-split-by-heading/dist')

function introductionAndConclusionVisitor (headingDepth = 0, currentDepth = 0) {
  return (ctx, rootNode) => {
    const splitted = splitAtDepth(rootNode, currentDepth + 1)
    const conclusionCandidate = splitted.subTrees[splitted.subTrees.length]
    const titleContent = conclusionCandidate.title.children
    if (titleContent.length === 1 && titleContent[0].value &&
      titleContent[0].value.toLowerCase().trim() === 'conclusion') {
      rootNode.children.splice(conclusionCandidate.index, 1 + conclusionCandidate.children.length,
        {
          type: 'conclusion',
          depth: currentDepth,
          children: conclusionCandidate.children,
        })
      splitted.subTrees.splice(splitted.subTrees.length - 1, 1)
    }
    rootNode.children.splice(0, splitted.introduction.children.length, splitted.introduction)
    splitted.introduction.type = 'introduction'
    splitted.introduction.depth = currentDepth
    if (currentDepth < headingDepth) {
      splitted.subTrees.forEach((subTree) => introductionAndConclusionVisitor(headingDepth,
        currentDepth + 1)(ctx, subTree))
    }
  }
}
module.exports = introductionAndConclusionVisitor
