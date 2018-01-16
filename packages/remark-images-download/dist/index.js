'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var visit = require('unist-util-visit');
var fs = require('fs');
var path = require('path');
var request = require('request');
var shortid = require('shortid');
var fileType = require('file-type');
var URL = require('url');

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

function plugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === undefined ? false : _ref$disabled,
      _ref$maxFileSize = _ref.maxFileSize,
      maxFileSize = _ref$maxFileSize === undefined ? 1000000 : _ref$maxFileSize,
      _ref$dirSizeLimit = _ref.dirSizeLimit,
      dirSizeLimit = _ref$dirSizeLimit === undefined ? 10000000 : _ref$dirSizeLimit,
      _ref$downloadDestinat = _ref.downloadDestination,
      downloadDestination = _ref$downloadDestinat === undefined ? '/tmp' : _ref$downloadDestinat;

  return function transform(tree, vfile) {
    if (disabled) return noop;
    var totalDownloadedSize = void 0;

    // images are downloaded to destinationPath
    var destinationPath = path.join(downloadDestination, shortid.generate());

    vfile.data.imageDir = destinationPath;

    return mkdir(destinationPath).then(function () {
      totalDownloadedSize = 0;
      var promises = [{ offset: -1, promise: noop }];

      visit(tree, 'image', function (node) {
        var url = node.url,
            position = node.position;

        var parsedURI = URL.parse(url);

        if (!parsedURI.host) return;

        var extension = path.extname(parsedURI.pathname);
        var filename = '' + shortid.generate() + extension;
        var destination = path.join(destinationPath, filename);

        var promise = new Promise(function (resolve, reject) {

          var writeStream = function writeStream(destination) {
            return fs.createWriteStream(destination).on('close', function () {
              node.url = destination;
              resolve();
            });
          };

          request.get(url).on('response', function () {
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
              res.destroy();
              var type = fileType(chunk) || { mime: '' };
              if (type.mime.slice(0, 6) !== 'image/') {
                reject(new Error('Detected mime of ' + url + ' is not an image/ type'));
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