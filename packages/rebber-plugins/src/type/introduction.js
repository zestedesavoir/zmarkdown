module.exports = introduction
const all = require('rebber/dist/all')
const introductionCommands = ['\\levelOneIntroduction', '\\levelTwoIntroduction',
  '\\levelThreeIntroduction']
function introduction (ctx, node) {
  const commands = ctx.introductionCommands || introductionCommands
  return `${commands[node.depth]}{${all(ctx, node)}}`
}
