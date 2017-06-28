'use strict';

var all = require('../all');
var has = require('has');
module.exports = list;

var defaultMacro = function defaultMacro(innerText, isOrdered) {
  if (isOrdered) {
    return '\\begin{enumerate}\n' + innerText + '\\end{enumerate}\n';
  } else {
    return '\\begin{itemize}\n' + innerText + '\\end{itemize}\n';
  }
};

function list(ctx, node) {
  var rebberList = has(ctx, 'list') ? ctx.list : defaultMacro;
  var itemized = all(ctx, node);
  return rebberList(itemized, node.ordered);
}