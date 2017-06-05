'use strict';

/* Dependencies. */
var has = require('has');

/* Expose. */
module.exports = one;

/* Handlers. */
var handlers = {};

handlers.root = require('./all');
handlers.heading = require('./types/heading');
handlers.paragraph = require('./types/paragraph');
handlers.comment = require('./types/comment');

handlers.text = require('./types/text');
handlers.strong = require('./types/strong');
handlers.emphasis = require('./types/emphasis');
handlers.delete = require('./types/delete');

/* Stringify `node`. */
function one(ctx, node, index, parent) {
  var type = node && node.type;

  if (!type) {
    throw new Error('Expected node, not `' + node + '`');
  }

  if (!has(handlers, type)) {
    throw new Error('Cannot compile unknown node `' + type + '`');
  }

  return handlers[type](ctx, node, index, parent);
}