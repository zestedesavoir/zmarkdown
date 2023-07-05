"use strict";

/* Dependencies. */
var path = require('path');
/* Expose. */


module.exports = image;

var defaultInlineMatcher = function defaultInlineMatcher(node, parent) {
  return parent.type === 'paragraph' && parent.children.length - 1 || parent.type === 'heading';
};

var defaultMacro = function defaultMacro(node) {
  /*
  Note that MDAST `Image` nodes don't have a `width` property.
  You might still want to specify a width since \includegraphics handles it.
  */
  var width = node.width ? "[width=".concat(node.width, "]") : '';
  return "\\includegraphics".concat(width, "{").concat(node.url, "}");
};

var defaultInline = defaultMacro;

function image(ctx, node, _, parent) {
  var options = ctx.image || {};

  if (node.url) {
    // Avoid a security flaw: trying to escape image paths
    node.url = node.url.replace(/}/g, '');

    try {
      var _path$parse = path.parse(node.url),
          root = _path$parse.root,
          dir = _path$parse.dir,
          base = _path$parse.base,
          ext = _path$parse.ext,
          name = _path$parse.name; // \includegraphics crashes with filenames that contain more than one `.`,
      // the workaround is \includegraphics{/path/to/{image.foo}.jpg}


      if (base.includes('.')) {
        var safeName = name.includes('.') ? "{".concat(name, "}").concat(ext) : "".concat(name).concat(ext);
        node.url = "".concat(path.format({
          root: root,
          dir: dir
        })).concat(safeName);
      }
    } catch (e) {
      node.url = '';
    }
  }

  var macro = options.image ? options.image : defaultMacro;
  var inlineMatcher = options.inlineMatcher ? options.inlineMatcher : defaultInlineMatcher;

  if (inlineMatcher(node, parent)) {
    macro = options.inlineImage ? options.inlineImage : defaultInline;
  }

  return macro(node);
}