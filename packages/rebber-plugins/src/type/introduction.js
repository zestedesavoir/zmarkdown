module.exports = introduction
const all = require('rebber/dist/all')
const introductionCommands = ['levelOneIntroduction', 'levelTwoIntroduction',
  'levelThreeIntroduction']
function introduction (ctx, node) {
  const commands = ctx.introductionCommands || introductionCommands
  const command = commands[node.depth]
  return `\\begin{${command}}\n${all(ctx, node)}\n\\end{${command}`
}
