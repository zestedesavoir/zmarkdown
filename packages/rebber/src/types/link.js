/* Dependencies. */
const has = require('has')
const all = require('../all')

/* Expose. */
module.exports = link

const defaultMacro = (displayedText, link) => `\\externalLink{${displayedText}}{${link}}`

/* Stringify a link `node`.
*/
function link (ctx, node) {
  const config = ctx.link || {}
  const macro = has(config, 'macro') ? config.macro : defaultMacro
  const prefix = has(config, 'prefix') ? config.prefix : ''
  const url = node.url.startsWith('/') ? prefix + node.url : node.url
  return macro(all(ctx, node), url, node.title)
}
