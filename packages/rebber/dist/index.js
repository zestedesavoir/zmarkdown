"use strict";

/* Dependencies. */
var xtend = require('xtend');

var definitions = require('mdast-util-definitions');

var one = require('./one');

var preprocess = require('./preprocessors');
/* Expose. */


module.exports = stringify;
module.exports.toLaTeX = toLaTeX;

function toLaTeX(tree) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  /* Stringify the given MDAST node. */
  preprocess(options, tree); // resolve definition after preprocess because this step can create new identifiers

  options.definitions = definitions(tree, options);
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