"use strict";

var clone = require('clone');

var visit = require('unist-util-visit');

module.exports = processQuizzFactory;

function processQuizzFactory(ctx) {
  var correctionTitle = ctx.correctionTitle || 'Correction';
  return function quizzCustomBlockVisitor(node, index, parent) {
    if (node.children.length < 2 || !node.children[0].children || !node.children[1].children) {
      return;
    }

    node.type = 'neutralCustomBlock';
    var correction = clone(node);
    correction.type = 'sCustomBlock';
    correction.children[0].children[0].value = correctionTitle;
    parent.children.splice(index + 1, 0, correction);
    var bodyChildren = node.children[1].children;

    while (bodyChildren.length > 0 && bodyChildren[bodyChildren.length - 1].type !== 'listItem') {
      bodyChildren.splice(bodyChildren.length - 1, 1);
    }

    visit(node, 'listItem', function (itemNode) {
      itemNode.checked = null;
    });
  };
}