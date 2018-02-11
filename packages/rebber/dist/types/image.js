'use strict';

/* Expose. */
module.exports = image;

var defaultMacro = function defaultMacro(node) {
  /*
  Note that MDAST `Image` nodes don't have a `width` property.
  You might still want to specify a width since \includegraphics handles it.
  */
  var width = node.width ? '[width=' + node.width + ']' : '';
  return '\\includegraphics' + width + '{' + node.url + '}';
};

var defaultInline = defaultMacro;

function image(ctx, node, _, parent) {
  var options = ctx.image || {};

  /*
  LaTeX cannot handle remote images, only local ones.
  \includegraphics crashes with filenames that contain more than one `.`,
  the workaround is \includegraphics{/path/to/{image.foo}.jpg}
  */
  if (node.url) {
    var pathParts = node.url.split('/');
    var filename = pathParts.pop();

    if (filename.includes('.')) {
      var filenameParts = filename.split('.');
      var extension = filenameParts.pop();
      var basename = filenameParts.join('.');

      var safeBasename = basename.includes('.') ? '{' + basename + '}.' + extension : basename + '.' + extension;

      pathParts.push(safeBasename);

      node.url = '' + pathParts.join('/');
    }
  }

  var macro = options.image ? options.image : defaultMacro;
  if (parent.type === 'paragraph' && parent.children.length - 1) {
    macro = options.inlineImage ? options.inlineImage : defaultInline;
  }

  return macro(node);
}