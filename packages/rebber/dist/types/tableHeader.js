'use strict';

var all = require('../all');

module.exports = function (ctx, node) {
  var macro = ctx.tableHeader ? ctx.tableHeader : all;
  return macro(ctx, node);
};