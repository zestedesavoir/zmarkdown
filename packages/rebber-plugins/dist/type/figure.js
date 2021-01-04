"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');

var one = require('rebber/dist/one');

var defaultCodeStringifier = require('rebber/dist/types/code').macro;

var has = require('has');
/* Expose. */


module.exports = figure;
var defaultMacros = {
  blockquote: function blockquote(_, innerText) {
    var caption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Anonymous';
    return "\\begin{Quotation}[".concat(caption, "]\n").concat(innerText, "\n\\end{Quotation}\n\n");
  },
  code: function code(ctx, _code, caption, extra) {
    var codeStringifier = has(ctx, 'code') && ctx.code || defaultCodeStringifier; // Remove the two last line feed

    var rebberCode = codeStringifier(_code, extra.language, extra.others).slice(0, -2);
    return "".concat(rebberCode, "\n\\captionof{listing}{").concat(caption, "}\n\n");
  },
  image: function image(_1, _2, caption, extra) {
    return "\\begin{center}\n" + "\\includegraphics".concat(extra.width ? "[".concat(extra.width, "]") : '', "{").concat(extra.url, "}\n") + "\\captionof{figure}{".concat(caption, "}\n") + "\\end{center}\n";
  }
};
var makeExtra = {
  blockquote: function blockquote(node) {},
  code: function code(node) {
    return {
      language: node.lang || 'text',
      others: node.meta
    };
  },
  image: function image(node) {
    return {
      url: node.url,
      width: '\\linewidth'
    };
  }
};
/* Stringify a Figure `node`. */

function figure(ctx, node, index, parent) {
  var type = node.children[0].type;
  var macro = has(ctx, 'figure') && has(ctx.figure, type) && ctx.figure[type] || has(defaultMacros, type) && defaultMacros[type];
  var caption = '';

  if (node.children.length) {
    caption = node.children.filter(function (captionNode) {
      return captionNode.type === 'figcaption';
    }).map(function (captionNode) {
      return all(ctx, captionNode);
    }).join('');
  }

  node.caption = caption; // allows to add caption to the default processing

  if (!macro) {
    node.children[0].caption = caption;
    return one(ctx, node.children[0], 0, node);
  }

  var wrappedNode = node.children[0];
  wrappedNode.caption = node.caption;
  node.children = node.children.filter(function (node) {
    return node.type !== 'figcaption';
  });

  if (node.children.length === 1) {
    node.children = node.children[0].children;
  }

  var extra = has(makeExtra, type) ? makeExtra[type](wrappedNode) : undefined;
  var innerText = all(ctx, node) || node.value || '';
  return macro(ctx, innerText.trim(), caption, extra);
}