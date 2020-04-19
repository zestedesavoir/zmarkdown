const visit = require('unist-util-visit')

module.exports = (wrappers) => (tree) => {
  Object.keys(wrappers).forEach(nodeName =>
    wrappers[nodeName].forEach(wrapper => {
      visit(tree, wrapper)
    }))
}
