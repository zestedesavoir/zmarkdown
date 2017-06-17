'use strict';

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

  var leftAnglePattern = /<</gim;
  var result = input.replace(leftAnglePattern, leftMark);
  var leftAngleSpacePattern = new RegExp('(' + leftMark + ')(\\s)', 'gm');
  result = result.replace(leftAngleSpacePattern, '$1' + spaceChar);
  var rightAnglePattern = />>/gim;
  result = result.replace(rightAnglePattern, rightMark);
  var rightAngleSpacePattern = new RegExp('(\\s)(' + rightMark + ')', 'gm');
  return result.replace(rightAngleSpacePattern, spaceChar + '$2');
};