"use strict";

var xtend = require('xtend');

var visit = require('unist-util-visit');

var referenceVisitors = require('./referenceVisitors');

module.exports = preprocess;

function preprocess(ctx, tree) {
  var _referenceVisitors = referenceVisitors(),
      definitionVisitor = _referenceVisitors.definitionVisitor,
      imageReferenceVisitor = _referenceVisitors.imageReferenceVisitor;

  var defaultVisitors = {
    definition: [definitionVisitor],
    imageReference: [imageReferenceVisitor]
  };
  var visitors = xtend(defaultVisitors, ctx.preprocessors || {});
  Object.keys(visitors).forEach(function (nodeType) {
    if (Array.isArray(visitors[nodeType])) {
      visitors[nodeType].forEach(function (visitor) {
        return visit(tree, nodeType, visitor(ctx, tree));
      });
    } else {
      visit(tree, nodeType, visitors[nodeType](ctx, tree));
    }
  });
}