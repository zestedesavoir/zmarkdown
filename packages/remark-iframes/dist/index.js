'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var URL = require('url');
var urlParse = URL.parse;

module.exports = function plugin(opts) {
  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option');
  }

  function extractProvider(url) {
    var hostname = urlParse(url).hostname;
    return opts[hostname];
  }
  function computeFinalUrl(provider, url) {
    var finalUrl = url;
    if (provider.replace && provider.replace.length) {
      provider.replace.forEach(function (rule) {
        var _rule = _slicedToArray(rule, 2),
            from = _rule[0],
            to = _rule[1];

        if (from && to) finalUrl = finalUrl.replace(from, to);
      });
    }
    if (provider.removeFileName) {
      var parsed = urlParse(finalUrl);
      parsed.pathname = parsed.pathname.substring(0, parsed.pathname.lastIndexOf('/'));
      finalUrl = URL.format(parsed);
    }
    if (provider.append) {
      finalUrl += provider.append;
    }
    if (provider.removeAfter && finalUrl.indexOf(provider.removeAfter) !== -1) {
      finalUrl = finalUrl.substring(0, finalUrl.indexOf(provider.removeAfter));
    }
    return finalUrl;
  }
  function locator(value, fromIndex) {
    return value.indexOf('!(http', fromIndex);
  }
  function inlineTokenizer(eat, value, silent) {
    var eatenValue = '';
    var url = '';
    for (var i = 0; i < value.length && value[i - 1] !== ')'; i++) {
      eatenValue += value[i];
      if (value[i] !== '!' && value[i] !== '(' && value[i] !== ')') {
        url += value[i];
      }
    }

    /* istanbul ignore if - never used (yet) */
    if (silent) return true;

    var provider = extractProvider(url);

    if (!provider || provider.disabled === true || provider.match && provider.match instanceof RegExp && !provider.match.test(url)) {
      if (eatenValue.startsWith('!(http')) {
        eat(eatenValue)({
          type: 'text',
          value: eatenValue
        });
      } else {
        return;
      }
    } else {
      eat(eatenValue)({
        type: 'iframe',
        data: {
          hName: provider.tag,
          hProperties: {
            src: computeFinalUrl(provider, url),
            width: provider.width,
            height: provider.height,
            allowfullscreen: true,
            frameborder: '0'
          }
        }
      });
    }
  }
  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.iframes = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('autoLink'), 0, 'iframes');
};