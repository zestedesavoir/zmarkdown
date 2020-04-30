const has = require('has')

const defaultMacro = (innerText) => `\\item\\relax ${innerText}\n`

module.exports = listItem

function listItem (ctx, node) {
  const rebberListItem = has(ctx, 'listItem') ? ctx.listItem : defaultMacro

  return rebberListItem(require('../all')(ctx, node).trim())
}
