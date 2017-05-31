'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var urlParse = require('url').parse;

module.exports = function inlinePlugin(opts) {
  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option');
  }

  function extractProvider(url) {
    var hostname = urlParse(url).hostname;
    return opts[hostname];
  }
  function computeFinalUrl(provider, url) {
    var finalUrl = url;
    if (provider.replace) {
      for (var key in provider.replace) {
        finalUrl = finalUrl.replace(key, provider.replace[key]);
      }
    }
    if (provider.removeFileName) {
      finalUrl = finalUrl.substring(0, finalUrl.lastIndexOf('/'));
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
    if (!provider) {
      return false;
    } else if (provider.enabled === false || provider.domain && provider.domain.match && !provider.domain.match.exec(url)) {
      eat(eatenValue)({
        type: 'text',
        value: eatenValue
      });
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