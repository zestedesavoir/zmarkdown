'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var URL = require('url');
var urlParse = URL.parse;
var URLSearchParams = URL.URLSearchParams;

module.exports = function plugin(opts) {
  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option');
  }

  function extractProvider(url) {
    var hostname = urlParse(url).hostname;
    return opts[hostname];
  }

  function blockTokenizer(eat, value, silent) {
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
          type: 'paragraph',
          children: [{
            type: 'text',
            value: eatenValue
          }]
        });
      } else {
        return;
      }
    } else {
      var finalUrl = computeFinalUrl(provider, url);
      var thumbnail = computeThumbnail(provider, finalUrl);
      eat(eatenValue)({
        type: 'iframe',
        src: url,
        data: {
          hName: provider.tag,
          hProperties: {
            src: finalUrl,
            width: provider.width,
            height: provider.height,
            allowfullscreen: true,
            frameborder: '0'
          },
          thumbnail: thumbnail
        }
      });
    }
  }
  blockTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject blockTokenizer
  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.iframes = blockTokenizer;
  blockMethods.splice(blockMethods.indexOf('blockquote') + 1, 0, 'iframes');

  var Compiler = this.Compiler;
  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    if (!visitors) return;
    visitors.iframe = function (node) {
      return '!(' + node.src + ')';
    };
  }
};

function computeFinalUrl(provider, url) {
  var finalUrl = url;
  var parsed = urlParse(finalUrl);
  finalUrl = URL.format(parsed);
  if (provider.ignoredQueryStrings && parsed.search) {
    var search = new URLSearchParams(parsed.search);
    provider.ignoredQueryStrings.forEach(function (ignored) {
      return search.delete(ignored);
    });
    parsed.search = search.toString();
  }
  finalUrl = URL.format(parsed);
  if (provider.replace && provider.replace.length) {
    provider.replace.forEach(function (rule) {
      var _rule = _slicedToArray(rule, 2),
          from = _rule[0],
          to = _rule[1];

      if (from && to) finalUrl = finalUrl.replace(from, to);
      parsed = urlParse(finalUrl);
    });
  }

  if (provider.removeFileName) {
    parsed.pathname = parsed.pathname.substring(0, parsed.pathname.lastIndexOf('/'));
  }
  finalUrl = URL.format(parsed);
  if (provider.append) {
    finalUrl += provider.append;
  }

  if (provider.removeAfter && finalUrl.includes(provider.removeAfter)) {
    finalUrl = finalUrl.substring(0, finalUrl.indexOf(provider.removeAfter));
  }

  return finalUrl;
}

function computeThumbnail(provider, url) {
  var thumbnailURL = 'default image';
  var thumbnailConfig = provider.thumbnail;
  if (thumbnailConfig && thumbnailConfig.format) {
    thumbnailURL = thumbnailConfig.format;
    Object.keys(thumbnailConfig).filter(function (key) {
      return key !== 'format';
    }).forEach(function (key) {
      var search = new RegExp('{' + key + '}', 'g');
      var replace = new RegExp(thumbnailConfig[key]).exec(url);
      if (replace.length) thumbnailURL = thumbnailURL.replace(search, replace[1]);
    });
  }
  return thumbnailURL;
}

function locator(value, fromIndex) {
  return value.indexOf('!(http', fromIndex);
}