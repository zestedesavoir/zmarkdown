'use strict';

/* Dependencies. */
var all = require('../all');
var one = require('../one');
var has = require('has');

/* Expose. */
module.exports = math;

var defaultMacros = {
  inlineMath: function inlineMath(content) {
    return '$' + content + '$';
  },
  inlineMathDouble: function inlineMathDouble(content) {
    return '$$' + content + '$$';
  },
  math: function math(content) {
    return '\\[ ' + content + ' \\]\n\n';
  }

  /* Stringify a Figure `node`. */
};function math(ctx, node, index, parent) {
  var type = 'math';
  if (node.type === 'inlineMath') {
    try {
      var classes = node.data.hProperties.className.split(' ');
      type = classes.includes('inlineMathDouble') ? 'inlineMathDouble' : 'inlineMath';
    } catch (e) {
      console.error(e, 'This rebber math plugin is only compatible with remark-math.');
    }
  }

  var macro = has(ctx, 'math') && has(ctx.math, type) && ctx.math[type] || has(defaultMacros, type) && defaultMacros[type];

  var content = all(ctx, node) || node.value || '';
  return macro(content.trim());
}