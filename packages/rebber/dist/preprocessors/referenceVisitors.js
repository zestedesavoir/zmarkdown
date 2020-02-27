"use strict";

module.exports = function () {
  var state = {};
  return {
    definitionVisitor: function definitionVisitor() {
      return function (node, index, parent) {
        var identifier = node.identifier;

        while (Object.keys(state).includes(identifier)) {
          identifier += '-1';
        }

        state[identifier] = node.url;
        node.identifier = identifier; // force to remove twice so that latex compiles

        if (node.referenceType === 'shortcut') {
          // remark for abbr
          parent.children.splice(index, 1);
        }
      };
    },
    imageReferenceVisitor: function imageReferenceVisitor() {
      return function (node) {
        node.type = 'image';
        node.title = '';
        node.url = state[node.identifier];
      };
    },
    addIdentifier: function addIdentifier(identifier, content) {
      state[identifier] = content;
    }
  };
};