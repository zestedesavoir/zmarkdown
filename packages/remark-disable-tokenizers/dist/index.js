'use strict';

var clone = require('clone');

var noop = function noop() {
  return true;
};

var throwing = function throwing(msg) {
  return function () {
    throw new Error(msg);
  };
};

function plugin() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$block = _ref.block,
      block = _ref$block === undefined ? [] : _ref$block,
      _ref$inline = _ref.inline,
      inline = _ref$inline === undefined ? [] : _ref$inline;

  if (block.length) {
    block.filter(function (key) {
      if (Array.isArray(key)) return block.map(function (xs) {
        return xs[0];
      }).includes(key[0]);
      return block.includes(key);
    }).forEach(function (key) {
      if (Array.isArray(key) && key.length === 2) {
        _this.Parser.prototype.blockTokenizers[key[0]] = throwing(key[1]);
      } else {
        _this.Parser.prototype.blockTokenizers[key] = noop;
      }
    });
  }

  if (inline.length) {
    inline.filter(function (key) {
      if (Array.isArray(key)) return inline.map(function (xs) {
        return xs[0];
      }).includes(key[0]);
      return inline.includes(key);
    }).forEach(function (key) {
      var tokenizerName = void 0;
      var replacer = void 0;
      if (Array.isArray(key) && key.length === 2) {
        tokenizerName = key[0];
        replacer = throwing(key[1]);
      } else {
        tokenizerName = key;
        replacer = clone(noop);
      }
      if (_this.Parser.prototype.inlineTokenizers[tokenizerName]) {
        Object.keys(_this.Parser.prototype.inlineTokenizers[tokenizerName]).forEach(function (prop) {
          replacer[prop] = _this.Parser.prototype.inlineTokenizers[tokenizerName][prop];
        });
      }
      _this.Parser.prototype.inlineTokenizers[tokenizerName] = replacer;
    });
  }
}

module.exports = plugin;