'use strict';

/* Dependencies. */
var all = require('../all');
var has = require('has'

/* Expose. */
);module.exports = figure;

var defaultMacros = {
  blockquote: function blockquote(innerText) {
    var caption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Anonymous';
    return '\\begin{Quotation}{' + caption + '}\n' + innerText + '\n\\end{Quotation}\n\n';
  },
  code: function code(_code, caption, extra) {
    var params = '[' + caption + ']';
    if (extra.lines) {
      params += '[' + extra.lines + ']';
    }
    return '\\begin{codeBlock}' + params + '{' + extra.language + '}' + ('\n' + _code + '\n\\end{codeBlock}\n\n');
  },
  table: function table(innerText) {
    return innerText;
  }
};

var makeExtra = {
  blockquote: function blockquote(node) {},
  code: function code(node) {
    var extra = { language: node.lang.split(' ')[0] };
    if (node.lang.includes(' ')) {
      var tail = node.lang.split(' ')[1];
      if (tail) {
        extra.lines = tail.replace('hl_lines=', '').trim();
      }
    }
    return extra;
  }

  /* Stringify a Figure `node`. */
};function figure(ctx, node) {
  var type = node.children[0].type;
  var macro = has(ctx, 'figure') && has(ctx.figure, type) && ctx.figure[type] || has(defaultMacros, type) && defaultMacros[type];
  if (!macro) return;

  var caption = '';
  if (node.children.length) {
    caption = node.children.filter(function (node) {
      return node.type === 'figcaption';
    }).map(function (node) {
      return all(ctx, node);
    }).join('');
  }

  node.caption = caption; // allows to add caption to the default processing

  node.children = node.children.filter(function (node) {
    return node.type !== 'figcaption';
  });
  if (node.children.length === 1) {
    node.children = node.children[0].children;
  }

  var innerText = all(ctx, node) || node.value;
  return macro(innerText.trim(), caption, makeExtra[type](node));
}