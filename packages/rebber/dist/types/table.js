'use strict';

/* Expose. */
var one = require('../one');
module.exports = table;

var defaultMacro = function defaultMacro(ctx, node) {
  var parsed = node.children.map(function (n, index) {
    return one(ctx, n, index, node);
  });
  var inner = parsed.join('');
  var lengths = inner.split('\\hline\n').map(function (l) {
    return l.split('&').length;
  });
  var cols = lengths.sort(cmp)[0];
  var colHeader = '|';
  colHeader += 'c|'.repeat(cols);
  var addendum = '';
  if (node.caption) {
    addendum = '\n\\tablecaption{' + node.caption + '}\n';
  }
  return '\\begin{longtabu}{' + colHeader + '} \\hline\n' + inner + addendum + '\\end{longtabu}\n\n';
};

/* Stringify a table `node`. */
function table(ctx, node) {
  var macro = ctx.table || defaultMacro;
  return macro(ctx, node);
}

function cmp(a, b) {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
}