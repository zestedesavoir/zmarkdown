'use strict';

/* Dependencies. */
var all = require('rebber/dist/all');
var one = require('rebber/dist/one');
var has = require('has');

/* Expose. */
module.exports = figure;

var defaultMacros = {
  blockquote: function blockquote(innerText) {
    var caption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Anonymous';
    return '\\begin{Quotation}[' + caption + ']\n' + innerText + '\n\\end{Quotation}\n\n';
  },
  code: function code(_code, caption, extra) {
    var params = '[' + caption + ']';
    if (extra.lines) {
      params += '[' + extra.lines + ']';
    }
    return '\\begin{codeBlock}' + params + '{' + extra.language + '}' + ('\n' + _code + '\n\\end{codeBlock}\n\n');
  },
  image: function image(_, caption, extra) {
    return '\\begin{center}\n' + ('\\includegraphics' + (extra.width ? '[' + extra.width + ']' : '') + '{' + extra.url + '}\n') + ('\\captionof{figure}{' + caption + '}\n') + '\\end{center}\n';
  }
};

var makeExtra = {
  blockquote: function blockquote(node) {},
  code: function code(node) {
    var language = node.lang || 'text';
    var extra = { language: language.split(' ')[0] };
    if (language.includes(' ')) {
      var tail = node.lang.split(' ')[1];
      if (tail) {
        extra.lines = tail.replace('hl_lines=', '').trim();
      }
    }
    return extra;
  },
  image: function image(node) {
    return { url: node.url, width: '\\linewidth' };
  }

  /* Stringify a Figure `node`. */
};function figure(ctx, node, index, parent) {
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

  return macro(innerText.trim(), caption, extra);
}