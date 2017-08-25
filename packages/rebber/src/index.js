/* Dependencies. */
const xtend = require('xtend')
const one = require('./one')
const preprocess = require('./pre-visitors')

/* Expose. */
module.exports = stringify
module.exports.toLaTeX = toLaTeX

/* Stringify the given MDAST node. */
function toLaTeX (tree, options = {}) {
  preprocess(options, tree)
  return one(options, tree, undefined, undefined)
}

/* Compile MDAST tree using toLaTeX */
function stringify (config) {
  const settings = xtend(config, this.data('settings'))

  this.Compiler = compiler

  function compiler (tree) {
    return toLaTeX(tree, settings, tree)
  }
}
