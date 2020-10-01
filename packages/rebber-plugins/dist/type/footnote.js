"use strict";

/* Dependencies. */
var all = require('rebber/dist/all');
/* Expose. */


module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text, protect) {
  var footnote = "\\footnote[".concat(identifier, "]{\\footnotemark{footnote:").concat(identifier, "} ").concat(text, "}");

  if (protect) {
    return "".concat(footnote, "\\protect");
  }

  return footnote;
};

function autoId(node) {
  var _node$position$start = node.position.start,
      line = _node$position$start.line,
      column = _node$position$start.column,
      offset = _node$position$start.offset;
  return "l".concat(line, "c").concat(column, "o").concat(offset);
}
/* Stringify a footnote `node`. */


function notes(ctx, node) {
  var macro = ctx.footnote || defaultMacro;
  var protect = !!node.inHeading;
  var identifier = autoId(node);
  return macro(identifier, all(ctx, node).trim(), protect);
}