module.exports = conclusion
const all = require('rebber/dist/all')
const conclusionCommands = ['levelOneConclusion', 'levelTwoConclusion',
  'levelThreeConclusion']
function conclusion (ctx, node) {
  const commands = ctx.conclusionCommands || conclusionCommands
  const command = commands[node.depth]
  return `\\begin{${command}}\n${all(ctx, node)}\n\\end{${command}`
}
