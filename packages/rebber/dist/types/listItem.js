'use strict';

var has = require('has');

var defaultMacro = function defaultMacro(innerText) {
  return '\\item ' + innerText + '\n';
};

module.exports = listItem;

function listItem(ctx, node) {
  var rebberListItem = has(ctx, 'listItem') ? ctx.listItem : defaultMacro;

  return rebberListItem(require('../all')(ctx, node).trim());
}