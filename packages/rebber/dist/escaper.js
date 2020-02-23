"use strict";

/* Dependencies. */
var has = require('has');

var xtend = require('xtend');
/* Expose. */


module.exports = encode;
encode.escape = escape;
/* List of enforced escapes. */

var defaultEscapes = {
  '#': '\\#',
  '$': '\\$',
  '%': '\\%',
  '&': '\\&',
  '\\': '\\textbackslash{}',
  '^': '\\textasciicircum{}',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}'
  /* Encode special characters in `value`. */

};

function encode(value) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var escapes = xtend(defaultEscapes, opts);
  var set = toExpression(Object.keys(escapes));
  value = value.replace(set, function (_char, pos, val) {
    return one(_char, val.charAt(pos + 1), escapes);
  });
  return value;
}
/* Encode `char` according to `options`. */


function one(_char2, next, escapes) {
  if (has(escapes, _char2)) {
    return escapes[_char2];
  }

  return _char2;
}
/* Create an expression for `characters`. */


function toExpression(characters) {
  var pattern = characters.map(escapeRegExp).join('|');
  return new RegExp("[".concat(pattern, "]"), 'g');
}

function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}