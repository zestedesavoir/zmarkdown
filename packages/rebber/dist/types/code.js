"use strict";

/* Expose. */
module.exports = code;
var codeBlockParamsMapping = [null, 'hl_lines=', 'linenostart='];

var defaultMacro = function defaultMacro(content, lang, attrs) {
  // Default language is "text"
  if (!lang) lang = 'text'; // Create a list of attributes to be serialized

  var localCodeBlockParams = Array(codeBlockParamsMapping.length).fill(''); // Check for attributes and enumerate them

  if (attrs !== null) {
    for (var i = 0; i < codeBlockParamsMapping.length; i++) {
      var _param = codeBlockParamsMapping[i]; // Skip unwanted parameters

      if (_param === null) continue;
      var location = attrs.indexOf(_param); // Parse the attributes we know

      if (location > -1) {
        var begin = location + _param.length;
        var remaining = attrs.slice(begin);
        var length = remaining.indexOf(' ');
        var value = length > -1 ? attrs.slice(begin, begin + length) : remaining; // Remove string-delimiters

        if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1).trim();
        } // For hl_lines, we parse the parameters to ensure we don't have
        // inverted ranges.


        if (_param === 'hl_lines=') {
          var hlItems = value.split(/,| /);

          for (var _i in hlItems) {
            var item = hlItems[_i];

            if (!item.includes('-')) {
              continue;
            }

            var n = item.split('-').map(function (n) {
              return parseInt(n);
            }).filter(function (n) {
              return !isNaN(n);
            });

            if (n.length !== 2) {
              continue;
            }

            hlItems[_i] = "".concat(Math.min(n[0], n[1]), "-").concat(Math.max(n[0], n[1]));
          }

          value = hlItems.join(',');
        }

        localCodeBlockParams[i] = value;
      }
    }
  } // If we matched something, return optional arguments
  // Note that we do stop serialization on a chain of empty arguments


  var matched = localCodeBlockParams.reduce(function (a, v, i) {
    return v !== '' ? i : a;
  }, -1) + 1;
  var param = matched > 0 ? "[".concat(localCodeBlockParams.slice(0, matched).join(']['), "]") : '';
  return "\\begin{CodeBlock}".concat(param, "{").concat(lang, "}\n").concat(content, "\n\\end{CodeBlock}\n\n");
};
/* Stringify a code `node`. */


function code(ctx, node) {
  var macro = ctx.code || defaultMacro;
  return "".concat(macro(node.value, node.lang, node.meta, node));
}

code.macro = defaultMacro;