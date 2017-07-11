'use strict';

/**
 * Created by fdambrine on 06/07/17.
 */
module.exports = function (node, index, parent) {
  var linkNode = {
    type: 'link',
    url: node.data.hProperties.src,
    children: [{ type: 'text', value: node.data.hProperties.src }]
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
    parent.children.splice(index, 1, figureNode);
  } else {
    parent.children.splice(index, 1, thumbnailNode);
    parent.children[parent.children.length - 1].children.push(linkNode);
  }
};