'use strict';

var all = require('../all');
module.exports = function (ctx, node) {
  var displayedText = all(ctx, node);
  var signification = node.data.hProperties.title;
  return ctx.abbr ? ctx.abbr(displayedText, signification) : '\\abbr{' + displayedText + '}{' + signification + '}';
};