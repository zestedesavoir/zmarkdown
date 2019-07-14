"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('url'),
    format = _require.format,
    parse = _require.parse,
    URLSearchParams = _require.URLSearchParams;

var http = require('http');

var https = require('https');

var makeHttpRequest =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var parsedUrl = parse(url);
              var client = parsedUrl.protocol === 'https:' ? https : http;
              var options = Object.assign({}, parsedUrl, {
                timeout: 3000
              });
              var req = client.get(options, function (res) {
                var statusCode = res.statusCode;

                if (statusCode !== 200) {
                  req.abort();
                  res.resume();
                  reject(new Error("Received HTTP ".concat(statusCode, " for: ").concat(url)));
                } else {
                  res.setEncoding('utf8');
                  var rawData = '';
                  res.on('data', function (chunk) {
                    rawData += chunk;
                  });
                  res.on('end', function () {
                    var oembedRes;

                    try {
                      oembedRes = JSON.parse(rawData);
                    } catch (e) {
                      reject(e);
                    }

                    var oembedUrl = oembedRes.html.match(/src="([A-Za-z0-9_/?&=:.]+)"/)[1];
                    var oembedThumbnail = oembedRes.thumbnail_url;
                    resolve({
                      url: oembedUrl,
                      thumbnail: oembedThumbnail,
                      width: oembedRes.width,
                      height: oembedRes.height
                    });
                  });
                }
              });
              req.on('timeout', function () {
                req.abort();
                reject(new Error("Request timed out for: ".concat(url)));
              });
              req.on('error', function (e) {
                return reject(e);
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function makeHttpRequest(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = function plugin(opts) {
  if (_typeof(opts) !== 'object' || !Object.keys(opts).length) {
    throw new Error('remark-iframes needs to be passed a configuration object as option');
  }

  function detectProvider(url) {
    var hostname = parse(url).hostname;
    return opts[hostname];
  }

  function blockTokenizer(_x2, _x3, _x4) {
    return _blockTokenizer.apply(this, arguments);
  }

  function _blockTokenizer() {
    _blockTokenizer = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(eat, value, silent) {
      var eatenValue, url, specialChars, i, provider, finalUrl, thumbnail, fallback, reqUrl;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (value.startsWith('!(http')) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              eatenValue = '';
              url = '';
              specialChars = ['!', '(', ')'];

              for (i = 0; i < value.length && value[i - 1] !== ')'; i++) {
                eatenValue += value[i];

                if (!specialChars.includes(value[i])) {
                  url += value[i];
                }
              }
              /* istanbul ignore if - never used (yet) */


              if (!silent) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", true);

            case 8:
              provider = detectProvider(url);

              if (!(!provider || provider.disabled === true || provider.match && provider.match instanceof RegExp && !provider.match.test(url))) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", eat(eatenValue)({
                type: 'paragraph',
                children: [{
                  type: 'text',
                  value: eatenValue
                }]
              }));

            case 11:
              if (!provider.oembed) {
                _context2.next = 17;
                break;
              }

              reqUrl = "".concat(provider.oembed, "?format=json&url=").concat(encodeURIComponent(url));
              _context2.next = 15;
              return makeHttpRequest(reqUrl).then(function (oembedRes) {
                finalUrl = oembedRes.url;
                thumbnail = oembedRes.thumbnail;
                if (!provider.height) provider.height = oembedRes.height;
                if (!provider.width) provider.width = oembedRes.width;
                if (!provider.tag) provider.tag = 'iframe';
              }, function (e) {
                fallback = true;
              });

            case 15:
              _context2.next = 19;
              break;

            case 17:
              finalUrl = computeFinalUrl(provider, url);
              thumbnail = computeThumbnail(provider, finalUrl);

            case 19:
              if (!fallback) {
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
              } else {
                eat(eatenValue)({
                  type: 'link',
                  url: url,
                  children: [{
                    type: 'text',
                    value: url
                  }]
                });
              }

            case 20:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _blockTokenizer.apply(this, arguments);
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