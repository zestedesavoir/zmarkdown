'use strict';

module.exports = listItem;
var all = require('../all');
var has = require('has');
var defaultMacro = function defaultMacro(innerText) {
  return '\\item ' + innerText + '\n';
};

function listItem(ctx, node) {
  var rebberListItem = has(ctx, 'listItem') ? ctx.listItem : defaultMacro;
  return rebberListItem(all(ctx, node).trim());
}