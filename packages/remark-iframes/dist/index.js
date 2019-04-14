"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require('url'),
    format = _require.format,
    parse = _require.parse,
    URLSearchParams = _require.URLSearchParams;

module.exports = function plugin(opts) {
  if (_typeof(opts) !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option');
  }

  function detectProvider(url) {
    var hostname = parse(url).hostname;
    return opts[hostname];
  }

  function blockTokenizer(eat, value, silent) {
    if (!value.startsWith('!(http')) return;
    var eatenValue = '';
    var url = '';
    var specialChars = ['!', '(', ')'];

    for (var i = 0; i < value.length && value[i - 1] !== ')'; i++) {
      eatenValue += value[i];

      if (!specialChars.includes(value[i])) {
        url += value[i];
      }
    }
    /* istanbul ignore if - never used (yet) */


    if (silent) return true;
    var provider = detectProvider(url);

    if (!provider || provider.disabled === true || provider.match && provider.match instanceof RegExp && !provider.match.test(url)) {
      return eat(eatenValue)({
        type: 'paragraph',
        children: [{
          type: 'text',
          value: eatenValue
        }]
      });
    }

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

  var Parser = this.Parser; // Inject blockTokenizer

  var blockTokenizers = Parser.prototype.blockTokenizers;
  var blockMethods = Parser.prototype.blockMethods;
  blockTokenizers.iframes = blockTokenizer;
  blockMethods.splice(blockMethods.indexOf('blockquote') + 1, 0, 'iframes');
  var Compiler = this.Compiler;

  if (Compiler) {
    var visitors = Compiler.prototype.visitors;
    if (!visitors) return;

    visitors.iframe = function (node) {
      return "!(".concat(node.src, ")");
    };
  }
};

function computeFinalUrl(provider, url) {
  var finalUrl = url;
  var parsed = parse(finalUrl);

  if (provider.droppedQueryParameters && parsed.search) {
    var search = new URLSearchParams(parsed.search);
    provider.droppedQueryParameters.forEach(function (ignored) {
      return search["delete"](ignored);
    });
    parsed.search = search.toString();
    finalUrl = format(parsed);
  }

  if (provider.replace && provider.replace.length) {
    provider.replace.forEach(function (rule) {
      var _rule = _slicedToArray(rule, 2),
          from = _rule[0],
          to = _rule[1];

      if (from && to) finalUrl = finalUrl.replace(from, to);
      parsed = parse(finalUrl);
    });
    finalUrl = format(parsed);
  }

  if (provider.removeFileName) {
    parsed.pathname = parsed.pathname.substring(0, parsed.pathname.lastIndexOf('/'));
    finalUrl = format(parsed);
  }

  if (provider.removeAfter && finalUrl.includes(provider.removeAfter)) {
    finalUrl = finalUrl.substring(0, finalUrl.indexOf(provider.removeAfter));
  }

  if (provider.append) {
    finalUrl += provider.append;
  }

  return finalUrl;
}

function computeThumbnail(provider, url) {
  var thumbnailURL = '';
  var thumbnailConfig = provider.thumbnail;

  if (thumbnailConfig && thumbnailConfig.format) {
    thumbnailURL = thumbnailConfig.format;
    Object.keys(thumbnailConfig).filter(function (key) {
      return key !== 'format';
    }).forEach(function (key) {
      var search = new RegExp("{".concat(key, "}"), 'g');
      var replace = new RegExp(thumbnailConfig[key]).exec(url);
      if (replace) thumbnailURL = thumbnailURL.replace(search, replace[1]);
    });
  }

  return thumbnailURL;
}