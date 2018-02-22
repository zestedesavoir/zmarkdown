'use strict';

/* Dependencies. */
var has = require('has');

/* Expose. */
module.exports = emoticon;

/* Stringify an emoticon `node`. */
function emoticon(ctx, node) {
  var code = node.value;
  if (!ctx.emoticons || !has(ctx.emoticons, code)) return;

  return '\\smiley{' + ctx.emoticons[code] + '}';
}