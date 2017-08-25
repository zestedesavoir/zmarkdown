/* Dependencies. */
const has = require('has')

/* Expose. */
module.exports = emoticon

/* Stringify an emoticon `node`. */
function emoticon (ctx, node) {
  const code = node.code
  if (!ctx.emoticons || !has(ctx.emoticons, code)) return

  return `\\smiley{${ctx.emoticons[code]}}`
}
