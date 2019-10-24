"use strict";

/* Dependencies. */
var has = require('has');
/* Expose. */


module.exports = emoticon;
/* Stringify an emoticon `node`. */

function emoticon(ctx, node) {
  var code = node.value;
  if (!ctx.emoticons.emoticons || !has(ctx.emoticons.emoticons, code)) return;
  return "\\smiley{".concat(ctx.emoticons.emoticons[code], "}");
}