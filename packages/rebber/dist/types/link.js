'use strict';

/* Dependencies. */
var has = require('has');
var all = require('../all');

/* Expose. */
module.exports = link;

var defaultMacro = function defaultMacro(displayedText, link) {
  return '\\externalLink{' + displayedText + '}{' + link + '}';
};

/* Stringify a link `node`.
*/
function link(ctx, node) {
  if (!node.url) return '';
  var config = ctx.link || {};
  var macro = has(config, 'macro') ? config.macro : defaultMacro;
  var prefix = has(config, 'prefix') ? config.prefix : '';
  var url = node.url.startsWith('/') ? prefix + node.url : node.url;
  return macro(all(ctx, node), url, node.title);
}