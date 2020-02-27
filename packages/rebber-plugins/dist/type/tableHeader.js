"use strict";

module.exports = function (ctx, node, index, parent) {
  var one = require('rebber/dist/one');

  if (ctx.tableHeader) {
    return ctx.tableHeader(node.value);
  }

  if (index === 0 && parent.children.length > 1) {
    // if we are on first header row we do not want to switch back to
    // font of normal serie
    return node.children.map(function (n, childIndex) {
      return one(ctx, n, childIndex === 0 ? 0 : 2, node);
    }).join('');
  }

  var parsed = node.children.map(function (n, childIndex) {
    return one(ctx, n, index + childIndex, node);
  });
  return parsed.join('');
};