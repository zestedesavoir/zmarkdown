/* Dependencies. */
const xtend = require('xtend')

const one = require('./one')

/* Expose. */
module.exports = stringify

/* Stringify the given MDAST node. */
function toLaTeX (node, options) {
  return one(options, node)
}

/* Compile MDAST tree using toLaTeX */
function stringify (config) {
  const settings = xtend(config, this.data('settings'))

  this.Compiler = compiler

  function compiler (tree) {
    return toLaTeX(tree, settings)
  }
}
