"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fileType = require('file-type');

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
  return parseInt(headers['content-length'], 10);
};

var mkdir = function mkdir(path) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(path, function (err) {
      if (err) reject(new Error("Failed to create dir ".concat(path)));
      resolve();
    });
  });
};

var checkFileType = function checkFileType(name, data) {
  if (!data.length) {
    throw new Error("Empty file: ".concat(name));
  }

  var type = fileType(data) || {
    mime: ''
  };

  if (!type.mime || type.mime === 'application/xml') {
    if (!isSvg(data.toString())) {
      throw new Error("Could not detect ".concat(name, " mime type, not SVG either"));
    }
  } else if (type.mime.slice(0, 6) !== 'image/') {
    throw new Error("Detected mime of local file '".concat(name, "' is not an image/ type"));
  }
}; // Creates a Transform stream which raises an error if the file type
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
        try {
          checkFileType(fileName, chunk);
        } catch (error) {
          cb(error);
          return;
        }
      }

      firstChunk = false;
      cb(null, chunk);
    }
  });
};

var checkAndCopy =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(from, to) {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return promisify(fs.readFile)(from);

          case 2:
            data = _context.sent;
            checkFileType(from, data);
            _context.prev = 4;
            _context.next = 7;
            return promisify(fs.copyFile)(from, to);

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](4);
            throw new Error("Failed to copy ".concat(from, " to ").concat(to));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 9]]);
  }));

  return function checkAndCopy(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

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
    fileTooBig: false
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

  var doDownloadTasks =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(tasks) {
      var totalSize, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, task, fileSize, e;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return Promise.all(tasks.map(function (task) {
                return initDownload(task.url).then(function (res) {
                  task.res = res;
                }, function (error) {
                  task.error = error;
                });
              }));

            case 2:
              if (!dirSizeLimit) {
                _context2.next = 32;
                break;
              }

              totalSize = 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 7;
              _iterator = tasks[Symbol.iterator]();

            case 9:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context2.next = 18;
                break;
              }

              task = _step.value;

              if (!task.error) {
                _context2.next = 13;
                break;
              }

              return _context2.abrupt("continue", 15);

            case 13:
              fileSize = getSize(task.res.headers);

              if (totalSize + fileSize >= dirSizeLimit) {
                e = new Error("Cannot download ".concat(task.url, " because destination ") + 'directory reached size limit');
                task.error = e;
                task.res.destroy(e);
              } else {
                totalSize += fileSize;
              }

            case 15:
              _iteratorNormalCompletion = true;
              _context2.next = 9;
              break;

            case 18:
              _context2.next = 24;
              break;

            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](7);
              _didIteratorError = true;
              _iteratorError = _context2.t0;

            case 24:
              _context2.prev = 24;
              _context2.prev = 25;

              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }

            case 27:
              _context2.prev = 27;

              if (!_didIteratorError) {
                _context2.next = 30;
                break;
              }

              throw _iteratorError;

            case 30:
              return _context2.finish(27);

            case 31:
              return _context2.finish(24);

            case 32:
              _context2.next = 34;
              return Promise.all(tasks.map(function (task) {
                if (!task.error) {
                  return downloadAndSave(task.node, task.url, task.res, task.destination)["catch"](function (error) {
                    task.error = error;
                  });
                }
              }));

            case 34:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[7, 20, 24, 32], [25,, 27, 31]]);
    }));

    return function doDownloadTasks(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var doLocalCopyTasks = function doLocalCopyTasks(tasks) {
    return Promise.all(tasks.map(function (task) {
      if (task.localSourcePath.includes('../')) {
        task.error = new Error("Dangerous absolute image URL detected: ".concat(task.localSourcePath));
        return;
      }

      return checkAndCopy(task.localSourcePath, task.destination)["catch"](function (error) {
        task.error = error;
      });
    }));
  };

  return (
    /*#__PURE__*/
    function () {
      var _transform = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(tree, vfile) {
        var destinationPath, defaultImageDestination, downloadTasks, localCopyTasks, groupTasksByUrl, tasks, successfulTasks, failedTasks, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, task, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, node, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _task, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _node;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!disabled) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return");

              case 2:
                // images are downloaded to destinationPath
                destinationPath = path.join(downloadDestination, shortid.generate()); // allow to fallback when image is not found

                defaultImageDestination = defaultImagePath ? path.join(downloadDestination, defaultImagePath) : false;
                downloadTasks = [];
                localCopyTasks = [];
                visit(tree, 'image',
                /*#__PURE__*/
                function () {
                  var _ref4 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee3(node) {
                    var url, position, parsedURI, extension, filename, destination, localPath, _localUrlToLocalPath, from, to;

                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            url = node.url, position = node.position;
                            _context3.prev = 1;
                            parsedURI = URL.parse(url);
                            _context3.next = 9;
                            break;

                          case 5:
                            _context3.prev = 5;
                            _context3.t0 = _context3["catch"](1);
                            vfile.message("Invalid URL: ".concat(url), position, url);
                            return _context3.abrupt("return");

                          case 9:
                            extension = path.extname(parsedURI.pathname);
                            filename = "".concat(shortid.generate()).concat(extension);
                            destination = path.join(destinationPath, filename);

                            if (parsedURI.host) {
                              _context3.next = 25;
                              break;
                            }

                            if (!(typeof localUrlToLocalPath === 'function')) {
                              _context3.next = 17;
                              break;
                            }

                            localPath = localUrlToLocalPath(url);
                            _context3.next = 23;
                            break;

                          case 17:
                            if (!(Array.isArray(localUrlToLocalPath) && localUrlToLocalPath.length === 2)) {
                              _context3.next = 22;
                              break;
                            }

                            _localUrlToLocalPath = _slicedToArray(localUrlToLocalPath, 2), from = _localUrlToLocalPath[0], to = _localUrlToLocalPath[1];
                            localPath = url.replace(new RegExp("^".concat(from)), to);
                            _context3.next = 23;
                            break;

                          case 22:
                            return _context3.abrupt("return");

                          case 23:
                            localCopyTasks.push({
                              node: node,
                              url: url,
                              destination: destination,
                              localSourcePath: localPath
                            });
                            return _context3.abrupt("return");

                          case 25:
                            if (['http:', 'https:'].includes(parsedURI.protocol)) {
                              _context3.next = 28;
                              break;
                            }

                            vfile.message("Protocol '".concat(parsedURI.protocol, "' not allowed."), position, url);
                            return _context3.abrupt("return");

                          case 28:
                            downloadTasks.push({
                              node: node,
                              url: url,
                              destination: destination
                            });

                          case 29:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, null, [[1, 5]]);
                  }));

                  return function (_x6) {
                    return _ref4.apply(this, arguments);
                  };
                }()); // Group by URL in order to download each file only once

                groupTasksByUrl = function groupTasksByUrl(tasks) {
                  var map = new Map();
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = tasks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var task = _step2.value;
                      var otherTasks = map.get(task.url) || [];
                      map.set(task.url, otherTasks.concat([task]));
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                        _iterator2["return"]();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
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
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", tree);

              case 13:
                successfulTasks = [];
                _context4.next = 16;
                return mkdir(destinationPath);

              case 16:
                _context4.prev = 16;
                _context4.next = 19;
                return Promise.all([doDownloadTasks(downloadTasks), doLocalCopyTasks(localCopyTasks)]);

              case 19:
                failedTasks = tasks.filter(function (t) {
                  return t.error;
                });
                successfulTasks = tasks.filter(function (t) {
                  return !t.error;
                });
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context4.prev = 24;
                _iterator3 = failedTasks[Symbol.iterator]();

              case 26:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context4.next = 50;
                  break;
                }

                task = _step3.value;
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context4.prev = 31;

                for (_iterator5 = task.nodes[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  node = _step5.value;

                  // mutates the AST even in case of error if requested
                  if (defaultImageDestination && task.error.replaceWithDefault) {
                    node.url = defaultImageDestination;
                  }

                  vfile.message(task.error, node.position, task.url);
                }

                _context4.next = 39;
                break;

              case 35:
                _context4.prev = 35;
                _context4.t0 = _context4["catch"](31);
                _didIteratorError5 = true;
                _iteratorError5 = _context4.t0;

              case 39:
                _context4.prev = 39;
                _context4.prev = 40;

                if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                  _iterator5["return"]();
                }

              case 42:
                _context4.prev = 42;

                if (!_didIteratorError5) {
                  _context4.next = 45;
                  break;
                }

                throw _iteratorError5;

              case 45:
                return _context4.finish(42);

              case 46:
                return _context4.finish(39);

              case 47:
                _iteratorNormalCompletion3 = true;
                _context4.next = 26;
                break;

              case 50:
                _context4.next = 56;
                break;

              case 52:
                _context4.prev = 52;
                _context4.t1 = _context4["catch"](24);
                _didIteratorError3 = true;
                _iteratorError3 = _context4.t1;

              case 56:
                _context4.prev = 56;
                _context4.prev = 57;

                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }

              case 59:
                _context4.prev = 59;

                if (!_didIteratorError3) {
                  _context4.next = 62;
                  break;
                }

                throw _iteratorError3;

              case 62:
                return _context4.finish(59);

              case 63:
                return _context4.finish(56);

              case 64:
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context4.prev = 67;
                _iterator4 = successfulTasks[Symbol.iterator]();

              case 69:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context4.next = 93;
                  break;
                }

                _task = _step4.value;
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context4.prev = 74;

                for (_iterator6 = _task.nodes[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  _node = _step6.value;
                  // mutates the AST!
                  _node.url = _task.destination;
                }

                _context4.next = 82;
                break;

              case 78:
                _context4.prev = 78;
                _context4.t2 = _context4["catch"](74);
                _didIteratorError6 = true;
                _iteratorError6 = _context4.t2;

              case 82:
                _context4.prev = 82;
                _context4.prev = 83;

                if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                  _iterator6["return"]();
                }

              case 85:
                _context4.prev = 85;

                if (!_didIteratorError6) {
                  _context4.next = 88;
                  break;
                }

                throw _iteratorError6;

              case 88:
                return _context4.finish(85);

              case 89:
                return _context4.finish(82);

              case 90:
                _iteratorNormalCompletion4 = true;
                _context4.next = 69;
                break;

              case 93:
                _context4.next = 99;
                break;

              case 95:
                _context4.prev = 95;
                _context4.t3 = _context4["catch"](67);
                _didIteratorError4 = true;
                _iteratorError4 = _context4.t3;

              case 99:
                _context4.prev = 99;
                _context4.prev = 100;

                if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                  _iterator4["return"]();
                }

              case 102:
                _context4.prev = 102;

                if (!_didIteratorError4) {
                  _context4.next = 105;
                  break;
                }

                throw _iteratorError4;

              case 105:
                return _context4.finish(102);

              case 106:
                return _context4.finish(99);

              case 107:
                _context4.next = 114;
                break;

              case 109:
                _context4.prev = 109;
                _context4.t4 = _context4["catch"](16);
                vfile.message(_context4.t4);
                _context4.next = 114;
                return promisify(rimraf)(destinationPath);

              case 114:
                if (!successfulTasks.length) {
                  _context4.next = 118;
                  break;
                }

                vfile.data.imageDir = destinationPath;
                _context4.next = 120;
                break;

              case 118:
                _context4.next = 120;
                return promisify(rimraf)(destinationPath);

              case 120:
                return _context4.abrupt("return", tree);

              case 121:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[16, 109], [24, 52, 56, 64], [31, 35, 39, 47], [40,, 42, 46], [57,, 59, 63], [67, 95, 99, 107], [74, 78, 82, 90], [83,, 85, 89], [100,, 102, 106]]);
      }));

      function transform(_x4, _x5) {
        return _transform.apply(this, arguments);
      }

      return transform;
    }()
  );
}

module.exports = plugin;