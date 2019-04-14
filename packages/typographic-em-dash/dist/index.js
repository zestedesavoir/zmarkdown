"use strict";

var db = require('./db');

module.exports = function () {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      locale = _ref.locale;

  // Replace -- by \u2013 for all locales
  var dashChar = "\u2014";
  var dashPattern = /--/gm;
  var result = input.replace(dashPattern, "".concat(dashChar)); // nbsp inside em dash pairs
  // (foo -- bar -- baz. -> foo1—2bar2—1baz. where 1 is and 2 is nbsp

  if (Object.keys(db).includes(locale)) {
    var separation = new RegExp("(^|\\s)(".concat(dashChar, ")(\\s|$)"));
    var nnbs = db[locale];
    var temp = result;
    var isOpening = true;
    var startPosition = separation.exec(temp);
    result = '';

    while (startPosition) {
      result += temp.substring(0, startPosition.index);
      var replacement = isOpening ? "$1$2".concat(nnbs) : "".concat(nnbs, "$2$3");
      result += startPosition[0].replace(separation, replacement);
      temp = temp.substring(startPosition.index + startPosition[0].length, temp.length);
      startPosition = separation.exec(temp);
      isOpening = !isOpening;
    }

    result += temp;
  }

  return result;
};