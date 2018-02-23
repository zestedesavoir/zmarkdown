'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fileType = require('file-type');
var fs = require('fs');
var isSvg = require('is-svg');
var path = require('path');
var request = require('request');
var shortid = require('shortid');
var URL = require('url');
var visit = require('unist-util-visit');
var rimraf = require('rimraf');

var noop = Promise.resolve();

var isImage = function isImage() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return headers['content-type'].substring(0, 6) === 'image/';
};

var getSize = function getSize() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return parseInt(headers['content-length'], 10);
};

var mkdir = function mkdir(path) {
  return new Promise(function (resolve, reject) {
    fs.stat(path, function (err, stats) {
      if (err) {
        return fs.mkdir(path, function (err) {
          if (err) reject(new Error('Failed to create dir ' + path));
          resolve();
        });
      }

      if (!stats.isDirectory()) {
        reject(new Error(path + ' is not a directory!'));
      }

      resolve();
    });
  });
};

var checkAndCopy = function checkAndCopy(from, to) {
  return new Promise(function (resolve, reject) {
    fs.readFile(from, function (err, data) {
      if (err) reject(err);
      if (!data) {
        return reject(new Error('Empty file: ' + from));
      }
      var type = fileType(data) || { mime: '' };
      if (!type.mime || type.mime === 'application/xml') {
        if (!isSvg(data)) {
          return reject(new Error('Could not detect ' + from + ' mime type, not SVG either'));
        }
      } else if (type.mime.slice(0, 6) !== 'image/') {
        return reject(new Error('Detected mime of local file \'' + from + '\' is not an image/ type'));
      }
      fs.copyFile(from, to, function (err) {
        if (err) return reject(new Error('Failed to copy ' + from + ' to ' + to));

        resolve();
      });
    });
  });
};

function plugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === undefined ? false : _ref$disabled,
      _ref$maxFileSize = _ref.maxFileSize,
      maxFileSize = _ref$maxFileSize === undefined ? 1000000 : _ref$maxFileSize,
      _ref$dirSizeLimit = _ref.dirSizeLimit,
      dirSizeLimit = _ref$dirSizeLimit === undefined ? 10000000 : _ref$dirSizeLimit,
      _ref$downloadDestinat = _ref.downloadDestination,
      downloadDestination = _ref$downloadDestinat === undefined ? '/tmp' : _ref$downloadDestinat,
      localUrlToLocalPath = _ref.localUrlToLocalPath;

  return function transform(tree, vfile) {
    if (disabled) return noop;
    var totalDownloadedSize = void 0;

    // images are downloaded to destinationPath
    var destinationPath = path.join(downloadDestination, shortid.generate());

    return mkdir(destinationPath).then(function () {
      totalDownloadedSize = 0;
      var promises = [];

      visit(tree, 'image', function (node) {
        var url = node.url,
            position = node.position;

        var parsedURI = URL.parse(url);

        var extension = path.extname(parsedURI.pathname);
        var filename = '' + shortid.generate() + extension;
        var destination = path.join(destinationPath, filename);

        if (!parsedURI.host) {
          var localPath = void 0;
          if (typeof localUrlToLocalPath === 'function') {
            localPath = localUrlToLocalPath(url);
          } else if (Array.isArray(localUrlToLocalPath) && localUrlToLocalPath.length === 2) {
            var _localUrlToLocalPath = _slicedToArray(localUrlToLocalPath, 2),
                from = _localUrlToLocalPath[0],
                to = _localUrlToLocalPath[1];

            localPath = url.replace(new RegExp('^' + from), to);
          } else {
            return;
          }

          if (localPath.includes('../')) {
            vfile.message('Dangerous absolute image URL detected: ' + localPath, position, url);
            return;
          }

          var _promise = checkAndCopy(localPath, destination).then(function () {
            node.url = destination;
          }, function (err) {
            vfile.message(err, position, url);
          });

          promises.push({ offset: position.offset, promise: _promise });
          return;
        }

        var promise = new Promise(function (resolve, reject) {
          if (!['http:', 'https:'].includes(parsedURI.protocol)) {
            reject('Protocol \'' + parsedURI.protocol + '\' not allowed.');
          }

          var writeStream = function writeStream(destination) {
            return fs.createWriteStream(destination).on('close', function () {
              node.url = destination;
              resolve();
            });
          };

          request.get(url, function (err) {
            if (err) reject(err);
          }).on('response', function () {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                headers = _ref2.headers,
                statusCode = _ref2.statusCode;

            if (statusCode !== 200) {
              reject(new Error('Received HTTP' + statusCode + ' for: ' + url));
            }
            if (!isImage(headers)) {
              reject(new Error('Content-Type of ' + url + ' is not an image/ type'));
            }

            var fileSize = getSize(headers);
            if (maxFileSize && fileSize > maxFileSize) {
              reject(new Error('File at ' + url + ' weighs ' + headers['content-length'] + ', ' + ('max size is ' + maxFileSize)));
            }

            if (dirSizeLimit && totalDownloadedSize + fileSize >= dirSizeLimit) {
              reject(new Error('Cannot download ' + url + ' because destination directory reached size limit'));
            }

            totalDownloadedSize += fileSize;
          }).on('response', function (res) {
            res.once('data', function (chunk) {
              var type = fileType(chunk) || { mime: '' };
              if (type.mime.slice(0, 6) !== 'image/' && !isSvg(chunk.toString())) {
                if (type.mime) {
                  reject(new Error('Mime of ' + url + ' not allowed: \'' + type.mime + '\''));
                } else {
                  reject(new Error('Could not detect ' + url + ' mime type, not SVG either'));
                }
              }
            });
          }).on('error', function (err) {
            reject(err);
          }).pipe(writeStream(destination));
        }).catch(function (err) {
          vfile.message(err, position, url);
        });

        promises.push({ offset: position.offset, promise: promise });
      });

      if (!promises.length) {
        return new Promise(function (resolve, reject) {
          return rimraf(destinationPath, function (err) {
            if (err) reject(err);
            resolve();
          });
        });
      }

      vfile.data.imageDir = destinationPath;

      // Use offsets to ensure execution order
      // we don't want to download them in (possibly) random order.
      // More importantly: this makes tests stable.
      promises.sort(function (a, b) {
        return b.offset - a.offset;
      });

      return promises.map(function (a) {
        return a.promise;
      }).reduce(function (chain, currentTask) {
        return chain.then(function (chainResults) {
          return currentTask.then(function (currentResult) {
            return [].concat(_toConsumableArray(chainResults), [currentResult]);
          });
        });
      }, Promise.resolve([]));
    }).catch(function (err) {
      vfile.message(err);
    }).then(function () {
      return tree;
    });
  };
}

module.exports = plugin;