'use strict';

var all = require('../all');

/* Expose. */
module.exports = heading;

var defaultHeadings = [function (val) {
  return '\\part{' + val + '}\n';
}, function (val) {
  return '\\chapter{' + val + '}\n';
}, function (val) {
  return '\\section{' + val + '}\n';
}, function (val) {
  return '\\subsection{' + val + '}\n';
}, function (val) {
  return '\\subsubsection{' + val + '}\n';
}, function (val) {
  return '\\paragraph{' + val + '}\n';
}, function (val) {
  return '\\subparagaph{' + val + '}\n';
}];

/* Stringify a heading `node`.
 */
function heading(ctx, node) {
  var depth = node.depth;
  var content = all(ctx, node);

  var headings = ctx.heading || defaultHeadings;
  var fn = headings[node.depth];

  if (typeof fn !== 'function') {
    throw new Error('Cannot compile heading of depth ' + depth + ': not a function');
  }

  return fn(content);
}