"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require('url'),
    format = _require.format,
    parse = _require.parse,
    URLSearchParams = _require.URLSearchParams;

var visit = require('unist-util-visit');

var fetch = require('node-fetch');

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

    var finalUrl, thumbnail;
    var data = {
      hName: provider.tag || 'iframe',
      hProperties: {
        src: 'tmp',
        width: provider.width,
        height: provider.height,
        allowfullscreen: true,
        frameborder: '0'
      }
    };

    if (provider.oembed) {
      Object.assign(data, {
        oembed: {
          provider: provider,
          url: "".concat(provider.oembed, "?format=json&url=").concat(encodeURIComponent(url)),
          fallback: {
            type: 'link',
            url: url,
            children: [{
              type: 'text',
              value: url
            }]
          }
        }
      });
    } else {
      finalUrl = computeFinalUrl(provider, url);
      thumbnail = computeThumbnail(provider, finalUrl);
      Object.assign(data, {
        hProperties: {
          src: finalUrl,
          width: provider.width,
          height: provider.height,
          allowfullscreen: true,
          frameborder: '0'
        },
        thumbnail: thumbnail
      });
    }

    eat(eatenValue)({
      type: 'iframe',
      src: url,
      data: data
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

  return (
    /*#__PURE__*/
    function () {
      var _transform = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(tree, vfile, next) {
        var toVisit, nextVisitOrBail;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                nextVisitOrBail = function _ref4() {
                  if (toVisit === 0) next();
                };

                toVisit = 0;
                visit(tree, 'iframe',
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee(node) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            toVisit++;

                          case 1:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x4) {
                    return _ref.apply(this, arguments);
                  };
                }());
                nextVisitOrBail();
                visit(tree, 'iframe',
                /*#__PURE__*/
                function () {
                  var _ref2 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee2(node) {
                    var data, oembed, provider, fallback, _ref3, url, thumbnail, height, width, message;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (node.data.oembed) {
                              _context2.next = 4;
                              break;
                            }

                            toVisit--;
                            nextVisitOrBail();
                            return _context2.abrupt("return");

                          case 4:
                            data = node.data;
                            oembed = data.oembed;
                            provider = data.oembed.provider;
                            fallback = data.oembed.fallback;
                            _context2.prev = 8;
                            _context2.next = 11;
                            return fetchEmbed(oembed.url);

                          case 11:
                            _ref3 = _context2.sent;
                            url = _ref3.url;
                            thumbnail = _ref3.thumbnail;
                            height = _ref3.height;
                            width = _ref3.width;
                            node.thumbnail = thumbnail;
                            Object.assign(data.hProperties, {
                              src: url,
                              width: provider.width || width,
                              height: provider.height || height,
                              allowfullscreen: true,
                              frameborder: '0'
                            });
                            _context2.next = 27;
                            break;

                          case 20:
                            _context2.prev = 20;
                            _context2.t0 = _context2["catch"](8);
                            message = _context2.t0.message;

                            if (_context2.t0.name === 'AbortError') {
                              message = "oEmbed URL timeout: ".concat(oembed.url);
                            }

                            vfile.message(message, node.position, oembed.url);
                            node.data = {};
                            Object.assign(node, fallback);

                          case 27:
                            delete data.oembed;
                            toVisit--;
                            nextVisitOrBail();

                          case 30:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, null, [[8, 20]]);
                  }));

                  return function (_x5) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function transform(_x, _x2, _x3) {
        return _transform.apply(this, arguments);
      }

      return transform;
    }()
  );
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

function fetchEmbed(_x6) {
  return _fetchEmbed.apply(this, arguments);
}

function _fetchEmbed() {
  _fetchEmbed = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(url) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", fetch(url, {
              timeout: 1500
            }).then(function (res) {
              return res.json();
            }).then(function (oembedRes) {
              var oembedUrl = oembedRes.html.match(/src="([A-Za-z0-9_/?&=:.]+)"/)[1];
              var oembedThumbnail = oembedRes.thumbnail_url;
              return {
                url: oembedUrl,
                thumbnail: oembedThumbnail,
                width: oembedRes.width,
                height: oembedRes.height
              };
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _fetchEmbed.apply(this, arguments);
}