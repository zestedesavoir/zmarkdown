"use strict";

var splitAtDepth = require('mdast-util-split-by-heading/dist');

function introductionAndConclusionVisitor() {
  var headingDepth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var currentDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (ctx, rootNode) {
    var splitted = splitAtDepth(rootNode, currentDepth + 1);
    var conclusionCandidate = splitted.subTrees[splitted.subTrees.length];
    var titleContent = conclusionCandidate.title.children;

    if (titleContent.length === 1 && titleContent[0].value && titleContent[0].value.toLowerCase().trim() === 'conclusion') {
      rootNode.children.splice(conclusionCandidate.index, 1 + conclusionCandidate.children.length, {
        type: 'conclusion',
        depth: currentDepth,
        children: conclusionCandidate.children
      });
      splitted.subTrees.splice(splitted.subTrees.length - 1, 1);
    }

    rootNode.children.splice(0, splitted.introduction.children.length, splitted.introduction);
    splitted.introduction.type = 'introduction';
    splitted.introduction.depth = currentDepth;

    if (currentDepth < headingDepth) {
      splitted.subTrees.forEach(function (subTree) {
        return introductionAndConclusionVisitor(headingDepth, currentDepth + 1)(ctx, subTree);
      });
    }
  };
}

module.exports = introductionAndConclusionVisitor;