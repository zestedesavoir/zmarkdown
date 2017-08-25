'use strict';

var xtend = require('xtend');
var visit = require('unist-util-visit');

var codePlugin = require('./codeVisitor');
var headingPlugin = require('./headingVisitor');
var referencePlugin = require('./referenceVisitor');

module.exports = preVisit;

function preVisit(ctx, tree) {
  var defaultVisitors = {
    tableCell: [codePlugin(ctx, tree).codeInTableVisitor],
    definition: [referencePlugin(ctx).definitionVisitor],
    imageReference: [referencePlugin(ctx).imageReferenceVisitor],
    heading: [headingPlugin(ctx)]
  };

  var visitors = xtend(defaultVisitors, ctx.preprocessors || {});

  Object.keys(visitors).forEach(function (nodeType) {
    if (Array.isArray(visitors[nodeType])) {
      visitors[nodeType].forEach(function (visitor) {
        return visit(tree, nodeType, visitor);
      });
    } else {
      visit(tree, nodeType, visitors[nodeType]);
    }
  });
}