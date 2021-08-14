"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var FileType = require('file-type');

var fs = require('fs');

var isSvg = require('is-svg');

var path = require('path');

var _require = require('util'),
    promisify = _require.promisify;

var http = require('http');

var https = require('https');

var shortid = require('shortid');

var URL = require('url');

var visit = require('unist-util-visit');

var rimraf = require('rimraf');

var _require2 = require('stream'),
    Transform = _require2.Transform;

var isImage = function isImage(headers) {
  return headers['content-type'].substring(0, 6) === 'image/';
};

var getSize = function getSize() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var size = parseInt(headers['content-length'], 10);

  if (Number.isNaN(size)) {
    return 0;
  }

  return size;
};

var mkdir = function mkdir(path) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(path, function (err) {
      if (err) reject(new Error("Failed to create dir ".concat(path)));
      resolve();
    });
  });
};

var checkFileType = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name, data) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (data.length) {
              _context.next = 2;
              break;
            }

            throw new Error("Empty file: ".concat(name));

          case 2:
            return _context.abrupt("return", FileType.fromBuffer(data)["catch"](function () {}).then(function () {
              var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                mime: ''
              };

              if (!type.mime || type.mime === 'application/xml') {
                if (!isSvg(data.toString())) {
                  return Promise.reject(new Error("Could not detect ".concat(name, " mime type, not SVG either")));
                }
              } else if (type.mime.slice(0, 6) !== 'image/') {
                return Promise.reject(new Error("Detected mime of local file '".concat(name, "' is not an image/ type")));
              }

              return Promise.resolve();
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function checkFileType(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // Creates a Transform stream which raises an error if the file type
// is wrong or if the file is not a image.


var makeValidatorStream = function makeValidatorStream(fileName, maxSize) {
  var firstChunk = true;
  var totalSize = 0;
  return new Transform({
    flush: function flush(cb) {
      if (totalSize === 0) {
        cb(new Error("File at ".concat(fileName, " is empty")));
        return;
      }

      cb(null);
    },
    transform: function transform(chunk, encoding, cb) {
      totalSize += chunk.length;

      if (maxSize && maxSize < totalSize) {
        cb(new Error("File at ".concat(fileName, " weighs more than ").concat(maxSize)));
        return;
      }

      if (firstChunk) {
        checkFileType(fileName, chunk).then(function () {
          firstChunk = false;
          cb(null, chunk);
        })["catch"](function (error) {
          cb(error);
        });
      } else {
        cb(null, chunk);
        return;
      }
    }
  });
};

function plugin() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$disabled = _ref2.disabled,
      disabled = _ref2$disabled === void 0 ? false : _ref2$disabled,
      _ref2$maxFileSize = _ref2.maxFileSize,
      maxFileSize = _ref2$maxFileSize === void 0 ? 1000000 : _ref2$maxFileSize,
      _ref2$dirSizeLimit = _ref2.dirSizeLimit,
      dirSizeLimit = _ref2$dirSizeLimit === void 0 ? 10000000 : _ref2$dirSizeLimit,
      _ref2$downloadDestina = _ref2.downloadDestination,
      downloadDestination = _ref2$downloadDestina === void 0 ? '/tmp' : _ref2$downloadDestina,
      _ref2$defaultImagePat = _ref2.defaultImagePath,
      defaultImagePath = _ref2$defaultImagePat === void 0 ? false : _ref2$defaultImagePat,
      _ref2$defaultOn = _ref2.defaultOn,
      defaultOn = _ref2$defaultOn === void 0 ? {
    statusCode: false,
    mimeType: false,
    fileTooBig: false,
    invalidPath: false
  } : _ref2$defaultOn,
      localUrlToLocalPath = _ref2.localUrlToLocalPath,
      _ref2$httpRequestTime = _ref2.httpRequestTimeout,
      httpRequestTimeout = _ref2$httpRequestTime === void 0 ? 5000 : _ref2$httpRequestTime;

  // Sends an HTTP request, checks headers and resolves a readable stream
  // if headers are valid.
  // Rejects with an error if headers are invalid.
  var initDownload = function initDownload(url) {
    return new Promise(function (resolve, reject) {
      var parsedUrl = URL.parse(url);
      var proto = parsedUrl.protocol === 'https:' ? https : http;
      var options = Object.assign({}, parsedUrl, {
        timeout: httpRequestTimeout
      });
      var req = proto.get(options, function (res) {
        var headers = res.headers,
            statusCode = res.statusCode;
        var error;
        var fileSize = getSize(headers);

        if (statusCode !== 200) {
          error = new Error("Received HTTP".concat(statusCode, " for: ").concat(url));
          error.replaceWithDefault = defaultOn && defaultOn.statusCode;
        } else if (!isImage(headers)) {
          error = new Error("Content-Type of ".concat(url, " is not an image/ type"));
          error.replaceWithDefault = defaultOn && defaultOn.mimeType;
        } else if (maxFileSize && fileSize > maxFileSize) {
          error = new Error("File at ".concat(url, " weighs ").concat(headers['content-length'], ", ") + "max size is ".concat(maxFileSize));
          error.replaceWithDefault = defaultOn && defaultOn.fileTooBig;
        }

        if (error) {
          req.abort();
          res.resume();
          reject(error);
          return;
        }

        resolve(res);
      });
      req.on('timeout', function () {
        req.abort();
        reject(new Error("Request for ".concat(url, " timed out")));
      });
      req.on('error', function (err) {
        return reject(err);
      });
    });
  };

  var checkAndCopy = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(from, to) {
      var data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return promisify(fs.readFile)(from)["catch"](function (e) {
                e.replaceWithDefault = defaultOn && defaultOn.invalidPath;
                throw e;
              });

            case 2:
              data = _context2.sent;
              _context2.next = 5;
              return checkFileType(from, data);

            case 5:
              _context2.prev = 5;
              _context2.next = 8;
              return promisify(fs.copyFile)(from, to);

            case 8:
              _context2.next = 13;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](5);
              throw new Error("Failed to copy ".concat(from, " to ").concat(to));

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 10]]);
    }));

    return function checkAndCopy(_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }();

  var downloadAndSave = function downloadAndSave(node, sourceUrl, httpResponse, destinationPath) {
    return new Promise(function (resolve, reject) {
      return httpResponse.on('error', function (error) {
        reject(error);
        httpResponse.destroy(error);
      }).pipe(makeValidatorStream(sourceUrl, maxFileSize)).on('error', function (error) {
        reject(error);
        httpResponse.destroy(error);
      }).pipe(fs.createWriteStream(destinationPath)).on('error', function (error) {
        reject(error);
        httpResponse.destroy(error);
      }).on('close', function (e) {
        resolve();
      });
    });
  };

  var doDownloadTasks = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tasks) {
      var totalSize, _iterator, _step, task, fileSize, e;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return Promise.all(tasks.map(function (task) {
                return initDownload(task.url).then(function (res) {
                  task.res = res;
                }, function (error) {
                  task.error = error;
                });
              }));

            case 2:
              if (!dirSizeLimit) {
                _context3.next = 23;
                break;
              }

              totalSize = 0;
              _iterator = _createForOfIteratorHelper(tasks);
              _context3.prev = 5;

              _iterator.s();

            case 7:
              if ((_step = _iterator.n()).done) {
                _context3.next = 15;
                break;
              }

              task = _step.value;

              if (!task.error) {
                _context3.next = 11;
                break;
              }

              return _context3.abrupt("continue", 13);

            case 11:
              fileSize = getSize(task.res.headers);

              if (totalSize + fileSize >= dirSizeLimit) {
                e = new Error("Cannot download ".concat(task.url, " because destination ") + 'directory reached size limit');
                task.error = e;
                task.res.destroy(e);
              } else {
                totalSize += fileSize;
              }

            case 13:
              _context3.next = 7;
              break;

            case 15:
              _context3.next = 20;
              break;

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3["catch"](5);

              _iterator.e(_context3.t0);

            case 20:
              _context3.prev = 20;

              _iterator.f();

              return _context3.finish(20);

            case 23:
              _context3.next = 25;
              return Promise.all(tasks.map(function (task) {
                if (!task.error) {
                  return downloadAndSave(task.node, task.url, task.res, task.destination)["catch"](function (error) {
                    task.error = error;
                  });
                }
              }));

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[5, 17, 20, 23]]);
    }));

    return function doDownloadTasks(_x5) {
      return _ref4.apply(this, arguments);
    };
  }();

  var doLocalCopyTasks = function doLocalCopyTasks(tasks) {
    return Promise.all(tasks.map(function (task) {
      if (task.localSourcePath.includes('../')) {
        task.error = new Error("Dangerous absolute image URL detected: ".concat(task.localSourcePath));
        task.error.replaceWithDefault = defaultOn && defaultOn.invalidPath;
        return;
      }

      return checkAndCopy(task.localSourcePath, task.destination)["catch"](function (error) {
        task.error = error;
      });
    }));
  };

  return /*#__PURE__*/function () {
    var _transform = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(tree, vfile) {
      var destinationPath, defaultImageDestination, downloadTasks, localCopyTasks, groupTasksByUrl, tasks, successfulTasks, failedTasks, _iterator3, _step3, task, _iterator5, _step5, node, _iterator4, _step4, _task, _iterator6, _step6, _node;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!disabled) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return");

            case 2:
              // images are downloaded to destinationPath
              destinationPath = path.join(downloadDestination, shortid.generate()); // allow to fallback when image is not found

              defaultImageDestination = defaultImagePath ? path.join(downloadDestination, defaultImagePath) : false;
              downloadTasks = [];
              localCopyTasks = [];
              visit(tree, 'image', /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(node) {
                  var url, position, parsedURI, extension, filename, destination, localPath, _localUrlToLocalPath, from, to;

                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          url = node.url, position = node.position; // Empty URL make nasty error messages, so ignore them

                          if (url) {
                            _context4.next = 4;
                            break;
                          }

                          vfile.message("URL is empty", position);
                          return _context4.abrupt("return");

                        case 4:
                          _context4.prev = 4;
                          parsedURI = URL.parse(url);
                          _context4.next = 12;
                          break;

                        case 8:
                          _context4.prev = 8;
                          _context4.t0 = _context4["catch"](4);
                          vfile.message("Invalid URL: ".concat(url), position, url);
                          return _context4.abrupt("return");

                        case 12:
                          extension = path.extname(parsedURI.pathname);
                          filename = "".concat(shortid.generate()).concat(extension);
                          destination = path.join(destinationPath, filename);

                          if (parsedURI.host) {
                            _context4.next = 28;
                            break;
                          }

                          if (!(typeof localUrlToLocalPath === 'function')) {
                            _context4.next = 20;
                            break;
                          }

                          localPath = localUrlToLocalPath(url);
                          _context4.next = 26;
                          break;

                        case 20:
                          if (!(Array.isArray(localUrlToLocalPath) && localUrlToLocalPath.length === 2)) {
                            _context4.next = 25;
                            break;
                          }

                          _localUrlToLocalPath = _slicedToArray(localUrlToLocalPath, 2), from = _localUrlToLocalPath[0], to = _localUrlToLocalPath[1];
                          localPath = url.replace(new RegExp("^".concat(from)), to);
                          _context4.next = 26;
                          break;

                        case 25:
                          return _context4.abrupt("return");

                        case 26:
                          localCopyTasks.push({
                            node: node,
                            url: url,
                            destination: destination,
                            localSourcePath: localPath
                          });
                          return _context4.abrupt("return");

                        case 28:
                          if (['http:', 'https:'].includes(parsedURI.protocol)) {
                            _context4.next = 31;
                            break;
                          }

                          vfile.message("Protocol '".concat(parsedURI.protocol, "' not allowed."), position, url);
                          return _context4.abrupt("return");

                        case 31:
                          downloadTasks.push({
                            node: node,
                            url: url,
                            destination: destination
                          });

                        case 32:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4, null, [[4, 8]]);
                }));

                return function (_x8) {
                  return _ref5.apply(this, arguments);
                };
              }()); // Group by URL in order to download each file only once

              groupTasksByUrl = function groupTasksByUrl(tasks) {
                var map = new Map();

                var _iterator2 = _createForOfIteratorHelper(tasks),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var task = _step2.value;
                    var otherTasks = map.get(task.url) || [];
                    map.set(task.url, otherTasks.concat([task]));
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                return Array.from(map.values()).map(function (taskGroup) {
                  return Object.assign({}, taskGroup[0], {
                    nodes: taskGroup.map(function (t) {
                      return t.node;
                    })
                  });
                });
              };

              downloadTasks = groupTasksByUrl(downloadTasks);
              localCopyTasks = groupTasksByUrl(localCopyTasks);
              tasks = downloadTasks.concat(localCopyTasks);

              if (tasks.length) {
                _context5.next = 13;
                break;
              }

              return _context5.abrupt("return", tree);

            case 13:
              successfulTasks = [];
              _context5.next = 16;
              return mkdir(destinationPath);

            case 16:
              _context5.prev = 16;
              _context5.next = 19;
              return Promise.all([doDownloadTasks(downloadTasks), doLocalCopyTasks(localCopyTasks)]);

            case 19:
              failedTasks = tasks.filter(function (t) {
                return t.error;
              });
              successfulTasks = tasks.filter(function (t) {
                return !t.error;
              });
              _iterator3 = _createForOfIteratorHelper(failedTasks);

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  task = _step3.value;
                  _iterator5 = _createForOfIteratorHelper(task.nodes);

                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      node = _step5.value;

                      // mutates the AST even in case of error if requested
                      if (defaultImageDestination && task.error.replaceWithDefault) {
                        node.url = defaultImageDestination;
                      }

                      vfile.message(task.error, node.position, task.url);
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }

              _iterator4 = _createForOfIteratorHelper(successfulTasks);

              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  _task = _step4.value;
                  _iterator6 = _createForOfIteratorHelper(_task.nodes);

                  try {
                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                      _node = _step6.value;
                      // mutates the AST!
                      _node.url = _task.destination;
                    }
                  } catch (err) {
                    _iterator6.e(err);
                  } finally {
                    _iterator6.f();
                  }
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }

              _context5.next = 32;
              break;

            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](16);
              vfile.message(_context5.t0);
              _context5.next = 32;
              return promisify(rimraf)(destinationPath);

            case 32:
              if (!successfulTasks.length) {
                _context5.next = 36;
                break;
              }

              vfile.data.imageDir = destinationPath;
              _context5.next = 38;
              break;

            case 36:
              _context5.next = 38;
              return promisify(rimraf)(destinationPath);

            case 38:
              return _context5.abrupt("return", tree);

            case 39:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[16, 27]]);
    }));

    function transform(_x6, _x7) {
      return _transform.apply(this, arguments);
    }

    return transform;
  }();
}

module.exports = plugin;