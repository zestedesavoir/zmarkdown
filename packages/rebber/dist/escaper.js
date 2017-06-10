'use strict';

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
};

/* Encode special characters in `value`. */
function encode(value) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var escapes = xtend(defaultEscapes, opts);
  var set = toExpression(Object.keys(escapes));

  value = value.replace(set, function (char, pos, val) {
    return one(char, val.charAt(pos + 1), escapes);
  });

  return value;
}

/* Encode `char` according to `options`. */
function one(char, next, escapes) {
  if (has(escapes, char)) {
    return escapes[char];
  }

  return char;
}

/* Create an expression for `characters`. */
function toExpression(characters) {
  var pattern = characters.map(escapeRegExp).join('|');

  return new RegExp('[' + pattern + ']', 'g');
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}