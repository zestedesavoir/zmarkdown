'use strict';

var clone = require('clone');
var visit = require('unist-util-visit');
var xtend = require('xtend');

var legendBlock = {
  table: 'Table:',
  code: 'Code:'
};

var internLegendBlock = {
  blockquote: 'Source:',
  img: 'Figure:'
};

function plugin(opts) {
  var externalBlocks = xtend(legendBlock, opts && opts.external || {});
  var internalBlocks = xtend(internLegendBlock, opts && opts.internal || {});
  return transformer;

  function transformer(tree) {
    Object.keys(internalBlocks).forEach(function (nodeType) {
      return visit(tree, nodeType, internLegendVisitor(internalBlocks));
    });

    Object.keys(externalBlocks).forEach(function (nodeType) {
      return visit(tree, nodeType, externLegendVisitorCreator(externalBlocks));
    });
  }
}
function internLegendVisitor(internalBlocks) {
  return function (node, index, parent) {

    if (parent && parent.type === 'figure') return;
    var lastP = getLast(node.children);
    if (!lastP || lastP.type !== 'paragraph') return;
    var lastT = getLast(lastP.children);
    if (!lastT || lastT.type !== 'text') return;

    var lines = lastT.value.split('\n');
    var lastLine = getLast(lines);
    if (!lastLine) return;
    if (!lastLine.startsWith(internalBlocks[node.type])) return;
    var legend = lines.pop().slice(lastLine.indexOf(':') + 1).trim();

    lastT.value = lines.join('\n');

    var figcaption = {
      type: 'figcaption',
      children: [{
        type: 'text',
        value: legend
      }],
      data: {
        hName: 'figcaption'
      }
    };

    var figure = {
      type: 'figure',
      children: [clone(node), figcaption],
      data: {
        hName: 'figure'
      }
    };

    node.type = figure.type;
    node.children = figure.children;
    node.data = figure.data;
  };
}
function externLegendVisitorCreator(blocks) {
  return function (node, index, parent) {
    if (index + 1 < parent.children.length && parent.children[index + 1].type === 'paragraph') {
      var legendNode = parent.children[index + 1];
      var firstChild = legendNode.children[0];

      if (firstChild.value.startsWith(blocks[node.type])) {
        var legendNodes = [];
        var followingNodes = [];
        var firstTextLine = firstChild.value.replace(blocks[node.type], '').split('\n')[0];
        if (firstChild.value.indexOf('\n') !== -1) {
          followingNodes.push({ type: 'text',
            value: firstChild.value.replace(blocks[node.type], '').split('\n')[1] });
        }
        legendNodes.push({
          type: 'text',
          value: firstTextLine.trimLeft // remove the " " after the {prefix}:
          () });

        legendNode.children.forEach(function (node, index) {
          if (index === 0) return;
          if (node.type === 'text') {
            var keepInLegend = node.value.split('\n')[0];
            if (node.value.indexOf('\n') !== -1) {
              node.value = node.value.split('\n')[1];
              followingNodes.push(node);
            }
            legendNodes.push({ type: 'text', value: keepInLegend });
          } else {
            legendNodes.push(clone(node));
          }
        });

        var figcaption = {
          type: 'figcaption',
          children: legendNodes,
          data: {
            hName: 'figcaption'
          }
        };
        var figure = {
          type: 'figure',
          children: [clone(node), figcaption],
          data: {
            hName: 'figure'
          }
        };
        node.type = figure.type;
        node.children = figure.children;
        node.data = figure.data;
        if (followingNodes.length) {
          parent.children.splice(index + 1, 1, { type: 'paragraph', children: followingNodes });
        } else {
          parent.children.splice(index + 1, 1);
        }
      }
    }
  };
}

function getLast(xs) {
  var len = xs.length;
  if (!len) return;
  return xs[len - 1];
}

module.exports = plugin;