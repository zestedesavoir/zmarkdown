"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); // eslint-disable-line no-useless-escape
}

module.exports = function escapeEscaped() {
  var entitiesToKeep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['&'];

  if (!Array.isArray(entitiesToKeep) || !entitiesToKeep.length) {
    throw new Error('remark-escape-escaped needs to be passed a configuration array as option');
  }

  var pattern = entitiesToKeep.map(escapeRegExp).join('|');
  var regex = new RegExp("(".concat(pattern, ")"));

  function locator(value, fromIndex) {
    var indices = entitiesToKeep.map(function (entity) {
      return value.indexOf(entity, fromIndex);
    });
    return Math.min.apply(Math, _toConsumableArray(indices));
  }

  function inlineTokenizer(eat, value, silent) {
    var keep = regex.exec(value);

    if (keep) {
      if (keep.index !== 0) return true;
      /* istanbul ignore if - never used (yet) */

      if (silent) return true;
      eat(keep[0])({
        type: 'text',
        value: keep[0]
      });
    }
  }

  inlineTokenizer.locator = locator;
  var Parser = this.Parser; // Inject inlineTokenizer

  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.keep_entities = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'keep_entities');
};