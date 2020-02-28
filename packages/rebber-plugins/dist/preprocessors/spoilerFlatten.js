"use strict";

var visit = require('unist-util-visit');

module.exports = function (elemNames) {
  return function (_, tree) {
    // This should contain something like ['sCustomBlockBody', 'secretCustomBlockBody']
    var elemNamesBody = elemNames.map(function (v) {
      return v.concat('Body');
    }); // Iterate over the elements to be flattened

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = elemNamesBody[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var elemNameBody = _step.value;
        visit(tree, elemNameBody, function (node) {
          // Recursive function that flattens all matching elements and keeps the others
          function flattenTree(blockTree) {
            return blockTree.map(function (v) {
              if (elemNames.includes(v.type)) {
                // Get sCustomBlock > sCustomBlockBody > *
                var newTree = v.children.filter(function (v) {
                  return elemNamesBody.includes(v.type);
                }) // This is sub-optimal, but flatMap doesn't have good support by now
                .reduce(function (acc, e) {
                  return acc.concat(e.children);
                }, []); // First level of recursion: on direct descendents

                return flattenTree(newTree);
              } else {
                // Second level of recursion: on indirect descendents
                if (v.children) {
                  v.children = flattenTree(v.children);
                }

                return v;
              }
            }).reduce(function (acc, e) {
              return acc.concat(e);
            }, []);
          } // First round on direct children


          node.children = flattenTree(node.children);
        });
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };
};