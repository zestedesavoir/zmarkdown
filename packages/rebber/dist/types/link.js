"use strict";

/* Dependencies. */
var has = require('has');

var escape = require('../escaper');
/* Expose. */


module.exports = link;

var defaultMacro = function defaultMacro(displayText, url, title) {
  return "\\externalLink{".concat(displayText, "}{").concat(url, "}");
};
/* Stringify a link `node`.
*/


function link(ctx, node) {
  if (!node.url) return '';
  var config = ctx.link || {};
  var macro = has(config, 'macro') ? config.macro : defaultMacro;
  var prefix = has(config, 'prefix') ? config.prefix : '';
  var url = escape(node.url.startsWith('/') ? prefix + node.url : node.url);
  return macro(require('../all')(ctx, node), url, node.title);
}