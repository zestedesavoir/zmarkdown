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
handlers.text = require('./types/text');
handlers.comment = require('./types/comment');

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