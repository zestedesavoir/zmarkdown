'use strict';

var visit = require('unist-util-visit');
module.exports = plugin;
function plugin(ctx, root) {
  return { codeInTableVisitor: codeInTableVisitor };

  function codeInTableVisitor(node) {
    var inAnnex = [];
    var annexIndex = 1;
    visit(node, 'code', function (innerNode, index, _parent) {
      inAnnex.push({
        type: 'paragraph',
        children: [{
          type: 'definition',
          identifier: 'annex-' + annexIndex,
          referenceType: 'full',
          children: [{ type: 'text', value: 'code' }]
        }, { type: 'text', value: '\n' }, innerNode]
      });
      var referenceNode = {
        type: 'linkReference',
        identifier: 'annex-' + annexIndex
      };
      _parent.children.splice(index, 1, referenceNode);
      annexIndex++;
    });
    if (inAnnex.length) {
      root.children.push({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'Annexe' }]

      });
      inAnnex.forEach(function (element) {
        return root.children.push(element);
      });
    }
  }
}