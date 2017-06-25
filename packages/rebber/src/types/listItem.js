module.exports = listItem
const all = require('../all')
const has = require('has')
const defaultMacro = (innerText) => `\\item ${innerText}\n`

function listItem (ctx, node) {
  const rebberListItem = has(ctx, 'listItem') ? ctx.listItem : defaultMacro
  return rebberListItem(all(ctx, node).trim())
}
