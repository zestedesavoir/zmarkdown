"use strict";

module.exports = function () {
  return function (node, index, parent) {
    var linkNode = {
      type: 'link',
      url: node.data.hProperties.src,
      children: [{
        type: 'text',
        value: node.data.hProperties.src
      }]
    };
    var thumbnailNode = {
      type: 'image',
      url: node.data.thumbnail
    };

    if (parent.type !== 'figure') {
      var figureNode = {
        type: 'figure',
        children: [thumbnailNode, {
          type: 'figcaption',
          children: [linkNode]
        }]
      };
      parent.children[index] = figureNode;
    } else {
      parent.children[index] = thumbnailNode;
      parent.children[parent.children.length - 1].children.push(linkNode);
    }
  };
};