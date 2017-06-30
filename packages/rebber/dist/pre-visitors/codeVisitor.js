'use strict';

var visit = require('unist-util-visit');
module.exports = plugin;
function plugin(ctx, root) {
  return { codeInTableVisitor: codeInTableVisitor };

  function codeInTableVisitor(node, _, parent) {
    var inAnnex = [];
    var annexIndex = 1;
    visit(node, 'code', function (innerNode, index, parent) {
      inAnnex.push({
        type: 'paragraph',
        children: [{
          type: 'definition',
          identifier: 'annex-' + annexIndex,
          referenceType: 'full',
          children: { type: 'text', value: 'code' }
        }, innerNode]
      });
      var referenceNode = {
        type: 'linkReference',
        identifier: 'annex-' + annexIndex
      };
      parent.children(index, 1, referenceNode);
      annexIndex++;
    });
    if (inAnnex.length) {
      root.children.push({
        type: 'heading',
        depth: 1,
        children: { type: 'text', value: 'Annexe' }

      });
      inAnnex.forEach(root.children.push);
    }
  }
}