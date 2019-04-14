"use strict";

/* Expose. */
module.exports = notes;

var defaultMacro = function defaultMacro(identifier, text, protect) {
  var footnote = "\\footnote[".concat(identifier, "]{\\label{footnote:").concat(identifier, "} ").concat(text, "}");

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


function notes(ctx, node, _index, parent) {
  var macro = ctx.footnote || defaultMacro;
  var protect = !!node.inHeading;
  var identifier = autoId(node);
  return macro(identifier, require('../all')(ctx, node).trim(), protect);
}