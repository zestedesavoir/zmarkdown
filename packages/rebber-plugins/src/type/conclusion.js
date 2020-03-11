module.exports = conclusion
const all = require('rebber/dist/all')
const conclusionCommands = ['\\levelOneConclusion', '\\levelTwoConclusion',
  '\\levelThreeConclusion']
function conclusion (ctx, node) {
  const commands = ctx.conclusionCommands || conclusionCommands
  return `${commands[node.depth]}{${all(ctx, node)}}`
}
