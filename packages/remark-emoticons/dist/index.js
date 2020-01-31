"use strict";

var whitespace = require('is-whitespace-character');

function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

module.exports = function inlinePlugin(ctx) {
  var emoticonClasses = ctx && ctx.classes;
  var emoticonsRaw = ctx && ctx.emoticons;

  if (!emoticonsRaw) {
    throw new Error('remark-emoticons needs to be passed a configuration object as option');
  } // Convert emoticons to lowercase


  var emoticons = Object.keys(emoticonsRaw).reduce(function (acc, key) {
    acc[key.toLowerCase()] = emoticonsRaw[key];
    return acc;
  }, {}); // Create a list composed of the first character of each emoticon

  var firstChars = Object.keys(emoticons).reduce(function (acc, key) {
    var firstChar = key.charAt(0);
    if (acc.indexOf(firstChar) === -1) acc.push(firstChar);
    return acc;
  }, []);
  var pattern = Object.keys(emoticons).map(escapeRegExp).join('|');
  var regex = new RegExp("(?:\\s|^)(".concat(pattern, ")(?:\\s|$)"), 'i');

  function locator(value, fromIndex) {
    var lowestMatch = -1;

    for (var c = 0; c < firstChars.length; c++) {
      var _char = firstChars[c];
      var match = value.indexOf(_char, fromIndex);

      if (match === -1 && _char !== _char.toUpperCase()) {
        match = value.indexOf(_char.toUpperCase(), fromIndex);
      }

      if (match !== -1) {
        // A smiley should be precedeed by at least one whitespace
        if (whitespace(value[match - 1]) && (lowestMatch === -1 || match > lowestMatch)) {
          lowestMatch = match;
        }
      }
    }

    return lowestMatch;
  }

  function inlineTokenizer(eat, value, silent) {
    var keep = regex.exec(value);

    if (keep) {
      if (keep.index !== 0) return true;
      if (!keep[0].startsWith(keep[1])) return true;
      /* istanbul ignore if - never used (yet) */

      if (silent) return true;
      var toEat = keep[1];
      var emoticon = toEat.trim();
      var src = emoticons[emoticon.toLowerCase()];
      var emoticonNode = {
        type: 'emoticon',
        value: emoticon,
        data: {
          hName: 'img',
          hProperties: {
            src: src,
            alt: emoticon
          }
        }
      };

      if (emoticonClasses) {
        emoticonNode.data.hProperties["class"] = emoticonClasses;
      }

      eat(toEat)(emoticonNode);
    }
  }

  inlineTokenizer.locator = locator;
  var Parser = this.Parser; // Inject inlineTokenizer

  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.emoticons = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'emoticons');
  var Compiler = this.Compiler;

  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    if (!visitors) return;

    visitors.emoticon = function (node) {
      return node.value;
    };
  }
};