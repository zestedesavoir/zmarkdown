'use strict';

var clone = require('clone');
var visit = require('unist-util-visit');

function plugin() {
  return transformer;
}

function transformer(tree) {
  visit(tree, 'blockquote', visitor);
}

function visitor(node, index, parent) {
  if (parent && parent.type === 'figure') return;
  var lastP = getLast(node.children);
  if (!lastP || lastP.type !== 'paragraph') return;
  var lastT = getLast(lastP.children);
  if (!lastT || lastT.type !== 'text') return;

  var lines = lastT.value.split('\n');
  var lastLine = getLast(lines);
  if (!lastLine) return;
  if (!lastLine.includes(':')) return;
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
}

function getLast(xs) {
  var len = xs.length;
  if (!len) return;
  return xs[len - 1];
}

module.exports = plugin;