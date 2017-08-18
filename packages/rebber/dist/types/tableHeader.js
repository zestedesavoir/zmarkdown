'use strict';

module.exports = function (ctx, node) {
  var macro = ctx.tableHeader ? ctx.tableHeader : require('../all');
  return macro(ctx, node);
};