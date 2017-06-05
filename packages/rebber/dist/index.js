'use strict';

/* Dependencies. */
var xtend = require('xtend');

var one = require('./one');

/* Expose. */
module.exports = stringify;

/* Stringify the given MDAST node. */
function toLaTeX(node, options) {
  return one(options, node);
}

/* Compile MDAST tree using toLaTeX */
function stringify(config) {
  var settings = xtend(config, this.data('settings'));

  this.Compiler = compiler;

  function compiler(tree) {
    return toLaTeX(tree, settings);
  }
}