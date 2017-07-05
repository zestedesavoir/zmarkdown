'use strict';

var all = require('../all');
module.exports = definition;
var defaultMacro = function defaultMacro(ctx, identifier, url, title) {
  var node = {
    children: [{
      type: 'link',
      title: title,
      url: url,
      children: [{
        type: 'text',
        value: url
      }]
    }]
  };
  var link = all(ctx, node);
  return '\\footnote{\\label{' + identifier + '}' + link + '}';
};
function definition(ctx, node) {
  var macro = ctx.definition ? ctx.definition : defaultMacro;
  return macro(ctx, node.identifier, node.url, node.title);
}