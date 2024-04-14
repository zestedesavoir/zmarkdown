"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var visit = require('unist-util-visit');

module.exports = splitAtDepth;

function splitAtDepth(tree, _ref) {
  var _ref$splitDepth = _ref.splitDepth,
      splitDepth = _ref$splitDepth === void 0 ? 1 : _ref$splitDepth;
  var splitter = new Splitter(splitDepth);
  visit(tree, null, function (node, index, parent) {
    return splitter.visit(node, index, parent);
  });
  return {
    introduction: splitter.introduction,
    trees: splitter.subTrees
  };
}

function newRootTree() {
  var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return {
    type: 'root',
    children: children
  };
}

var Splitter = /*#__PURE__*/function () {
  function Splitter() {
    var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    _classCallCheck(this, Splitter);

    this.lastIndex = -1;
    this.subTrees = [];
    this.depth = depth;
    this.introduction = newRootTree();
  }

  _createClass(Splitter, [{
    key: "visit",
    value: function visit(node, index, parent) {
      if (!parent) {
        // we are at the root
        return;
      }

      if (node.type === 'heading' && node.depth === this.depth) {
        this.lastIndex = index;
        var subtree = {
          title: newRootTree(node),
          children: newRootTree()
        };
        this.subTrees.push(subtree);
      } else if (parent.type === 'root' && this.lastIndex === -1) {
        this.introduction.children.push(node);
      } else if (parent.type === 'root') {
        this.subTrees[this.subTrees.length - 1].children.children.push(node);
      }
    }
  }]);

  return Splitter;
}();