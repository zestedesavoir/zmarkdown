'use strict';

/* Dependencies. */
var xtend = require('xtend');
var one = require('./one');
var preprocess = require('./pre-visitors');

/* Expose. */
module.exports = stringify;

/* Stringify the given MDAST node. */
function toLaTeX(node, options, root) {
  return one(options, node, undefined, undefined, root);
}

/* Compile MDAST tree using toLaTeX */
function stringify(config) {
  var settings = xtend(config, this.data('settings'));

  this.Compiler = compiler;

  function compiler(tree) {
    preprocess(settings, tree);
    return toLaTeX(tree, settings, tree);
  }
}