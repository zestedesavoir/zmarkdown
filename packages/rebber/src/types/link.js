/* Dependencies. */
const has = require('has')
const all = require('../all')
const escape = require('../escaper')

/* Expose. */
module.exports = link

const defaultMacro = (displayedText, url, title) => `\\externalLink{${displayedText}}{${url}}`

/* Stringify a link `node`.
*/
function link (ctx, node) {
  if (!node.url) return ''
  const config = ctx.link || {}
  const macro = has(config, 'macro') ? config.macro : defaultMacro
  const prefix = has(config, 'prefix') ? config.prefix : ''
  const url = escape(node.url.startsWith('/') ? prefix + node.url : node.url)
  return macro(all(ctx, node), url, node.title)
}
