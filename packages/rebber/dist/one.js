'use strict';

/* Dependencies. */
var has = require('has');
var xtend = require('xtend'

/* Expose. */
);module.exports = one;

/* Handlers. */
var handlers = {};

handlers.root = require('./all');
handlers.heading = require('./types/heading');
handlers.paragraph = require('./types/paragraph');
handlers.comment = require('./types/comment');

handlers.text = require('./types/text');
handlers.break = require('./types/break');
handlers.code = require('./types/code');
handlers.strong = require('./types/strong');
handlers.emphasis = require('./types/emphasis');
handlers.delete = require('./types/delete');
handlers.inlineCode = require('./types/inlinecode');
handlers.blockquote = require('./types/blockquote');
handlers.thematicBreak = require('./types/thematic-break'

/* Stringify `node`. */
);function one(ctx, node, index, parent) {
  var handlersOverride = has(ctx, 'override') ? ctx.override : {};
  var h = xtend(handlers, handlersOverride);

  var type = node && node.type;

  if (!type) {
    throw new Error('Expected node, not `' + node + '`');
  }

  if (!has(h, type)) {
    throw new Error('Cannot compile unknown node `' + type + '`');
  }

  return h[type](ctx, node, index, parent);
}