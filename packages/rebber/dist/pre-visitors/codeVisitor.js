'use strict';

var visit = require('unist-util-visit');

module.exports = plugin;

var appendiceVisitorFactory = function appendiceVisitorFactory(_ref) {
  var title = _ref.title,
      root = _ref.root;
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
      root.children.push({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: title }]

      });
      inAppendix.forEach(function (element) {
        return root.children.push(element);
      });
    }
  };
};

function plugin(ctx, root) {
  var title = ctx.codeAppendiceTitle || 'Appendices';
  return {
    codeInTableVisitor: appendiceVisitorFactory({ title: title, root: root })
  };
}