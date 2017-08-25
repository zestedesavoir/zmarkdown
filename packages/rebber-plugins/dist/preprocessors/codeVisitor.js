'use strict';

var visit = require('unist-util-visit');

module.exports = function (ctx, tree) {
  var title = ctx.codeAppendiceTitle || 'Appendices';
  return function (node) {
    var inAppendix = [];
    var appendixIndex = 1;

    visit(node, 'code', function (innerNode, index, _parent) {
      inAppendix.push({
        type: 'paragraph',
        children: [{
          type: 'definition',
          identifier: 'appendix-' + appendixIndex,
          referenceType: 'full',
          children: [{ type: 'text', value: 'code' }]
        }, { type: 'text', value: '\n' }, innerNode]
      });
      var referenceNode = {
        type: 'linkReference',
        identifier: 'appendix-' + appendixIndex
      };
      _parent.children.splice(index, 1, referenceNode);
      appendixIndex++;
    });

    if (inAppendix.length) {
      tree.children.push({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: title }]

      });
      inAppendix.forEach(function (element) {
        return tree.children.push(element);
      });
    }
  };
};