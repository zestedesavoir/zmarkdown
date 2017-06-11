'use strict';

var db = require('./db');

module.exports = function () {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      locale = _ref.locale;

  var chars = {
    'PER MILLE SIGN': '\u2030'
  };

  var permillePattern = /%o/gim;
  var result = input.replace(permillePattern, chars['PER MILLE SIGN']);

  if (Object.keys(db).includes(locale)) {
    // If we need to replace spaces before the permille sign
    var spaceBeforePermillePattern = /( )(\u2030)/g;
    return result.replace(spaceBeforePermillePattern, db[locale] + '$2');
  }

  return result;
};