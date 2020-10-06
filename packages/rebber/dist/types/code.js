"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

          var _iterator = _createForOfIteratorHelper(hlItems.entries()),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _step$value = _slicedToArray(_step.value, 2),
                  _i = _step$value[0],
                  item = _step$value[1];

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
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
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