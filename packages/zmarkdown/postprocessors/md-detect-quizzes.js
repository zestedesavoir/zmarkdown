const visit = require('unist-util-visit')

module.exports = () => (tree, vfile) => {
  visit(tree, 'quizzCustomBlock', () => {
    vfile.data.hasQuizz = true
  })
}
