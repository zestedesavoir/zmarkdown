module.exports = link
const has = require('has')
const all = require('../all')
const defaultMacro = (displayedText, link) => `\\externalLink{${displayedText}}{${link}}`

function link (ctx, node) {
  let rebberLink = defaultMacro
  let rebberAutoPrepend = ''
  if (has(ctx, 'link') && (has(ctx.link, 'macro') || has(ctx.link, 'prefix'))) {
    rebberLink = ctx.link.macro || rebberLink
    rebberAutoPrepend = ctx.link.prefix || rebberAutoPrepend
  }
  let url = node.url
  if (url.startsWith('/')) {
    url = rebberAutoPrepend + url
  }
  return rebberLink(all(ctx, node), url, node.title)
}
