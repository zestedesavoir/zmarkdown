const visit = require('unist-util-visit')

module.exports = () => (tree, vfile) => {
  // if we don't have any headings, we add a flag to disable
  // the Table of Contents directly in the latex template
  vfile.data.disableToc = true
  visit(tree, 'heading', () => {
    vfile.data.disableToc = false
  })

  // get a unique list of languages used in input
  const languages = new Set()
  visit(tree, 'code', (node) => {
    if (node.lang) languages.add(node.lang)
  })
  vfile.data.languages = [...languages]
}