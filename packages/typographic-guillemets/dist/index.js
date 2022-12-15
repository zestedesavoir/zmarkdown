"use strict";

var db = require('./db');

module.exports = function () {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      locale = _ref.locale;

  if (!Object.keys(db).includes(locale)) return input;
  var chars = db[locale];
  var leftMark = chars['LEFT-POINTING ANGLE QUOTATION MARK'];
  var rightMark = chars['RIGHT-POINTING ANGLE QUOTATION MARK'];
  var spaceChar = chars['NARROW NO-BREAK SPACE'];
  var leftAnglePattern = /<<\s*/gm;
  var rightAnglePattern = /\s*>>/gm;
  return input.replace(leftAnglePattern, leftMark.concat(spaceChar)).replace(rightAnglePattern, spaceChar.concat(rightMark));
};