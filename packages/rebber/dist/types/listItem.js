"use strict";

var has = require('has');

var defaultMacro = function defaultMacro(innerText) {
  return "\\item\\relax ".concat(innerText, "\n");
};

var defaultCheckedMacro = function defaultCheckedMacro(innerText) {
  return "\\item[$\\boxtimes$]\\relax ".concat(innerText, "\n");
};

var defaultUncheckedMacro = function defaultUncheckedMacro(innerText) {
  return "\\item[$\\square$]\\relax ".concat(innerText, "\n");
};

module.exports = listItem;

function listItem(ctx, node) {
  var rebberListItem = has(ctx, 'listItem') ? ctx.listItem : defaultMacro;

  if (node.checked === true) {
    rebberListItem = has(ctx, 'checkedListItem') ? ctx.checkedListItem : defaultCheckedMacro;
  } else if (node.checked === false) {
    rebberListItem = has(ctx, 'uncheckedListItem') ? ctx.uncheckedListItem : defaultUncheckedMacro;
  }

  return rebberListItem(require('../all')(ctx, node).trim());
}