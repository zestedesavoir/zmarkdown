'use strict';

var visit = require('unist-util-visit');
var fs = require('fs');
var path = require('path');
var request = require('request-promise');
var shortid = require('shortid');
var url = require('url');

var noop = Promise.resolve();

var requestParser = function requestParser(body, response, resolveWithFullResponse) {
  return { response: response, body: body };
};

var writeFile = function writeFile(file, data, options) {
  return new Promise(function (resolve, reject) {
    var cb = function cb(err) {
      if (err) reject(err);
      resolve();
    };

    if (options) {
      fs.writeFile(file, data, options, cb);
    } else {
      fs.writeFile(file, data, cb);
    }
  });
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
      downloadDestination = _ref$downloadDestinat === undefined ? './' : _ref$downloadDestinat,
      _ref$report = _ref.report,
      report = _ref$report === undefined ? console.error : _ref$report;

  return function transform(tree) {
    if (disabled) return noop;
    var totalDownloadedSize = void 0;

    // images are downloaded in destinationPath
    var destinationPath = path.join(downloadDestination, shortid.generate());

    return mkdir(destinationPath).then(function () {
      totalDownloadedSize = 0;
      var promises = [noop];

      visit(tree, 'image', function (node) {
        var parsedURI = url.parse(node.url);

        if (!parsedURI.host) return;

        var extension = path.extname(parsedURI.pathname);
        var basename = '' + shortid.generate() + extension;
        var destination = path.join(destinationPath, basename);
        var imageURL = node.url;

        promises.push(isDownloadable(imageURL).then(function () {
          return request({ uri: imageURL, transform: requestParser });
        }).then(function (_ref2) {
          var body = _ref2.body;
          return writeFile(destination, body);
        }).then(function () {
          node.url = destination;
        }).catch(function (err) {
          return report(err);
        }));
      });

      return Promise.all(promises);
    }).catch(function (err) {
      return report(err);
    }).then(function () {
      return tree;
    });

    function isDownloadable(uri) {
      return request.head({ uri: uri, transform: requestParser }).then(function (_ref3) {
        var response = _ref3.response;
        return new Promise(function (resolve, reject) {
          if (response.headers['content-type'].substring(0, 6) !== 'image/') {
            reject(new Error('Content-Type of ' + uri + ' is not of image/ type'));
          }

          var fileSize = parseInt(response.headers['content-length'], 10);

          if (maxFileSize && fileSize > maxFileSize) {
            reject(new Error('File at ' + uri + ' weighs ' + response.headers['content-length'] + ', ' + ('max size is ' + maxFileSize)));
          }

          if (dirSizeLimit && totalDownloadedSize + fileSize >= dirSizeLimit) {
            reject(new Error('Cannot download ' + uri + ' because destination directory reached size limit'));
          }

          totalDownloadedSize += fileSize;
          resolve();
        });
      });
    }
  };
}

module.exports = plugin;