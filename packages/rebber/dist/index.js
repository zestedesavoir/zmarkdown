'use strict';

/* Dependencies. */
var xtend = require('xtend');
var one = require('./one');
var preprocess = require('./pre-visitors');

/* Expose. */
module.exports = stringify;
module.exports.toLaTeX = toLaTeX;

/* Stringify the given MDAST node. */
function toLaTeX(tree) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  preprocess(options, tree);
  return one(options, tree, undefined, undefined);
}

/* Compile MDAST tree using toLaTeX */
function stringify(config) {
  var settings = xtend(config, this.data('settings'));

  this.Compiler = compiler;

  function compiler(tree) {
    return toLaTeX(tree, settings, tree);
  }
}