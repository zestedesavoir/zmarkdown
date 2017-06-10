'use strict';

var db = require('./db');

module.exports = function () {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      locale = _ref.locale;

  if (!Object.keys(db).includes(locale)) return input;

  var handlePermille = db[locale];

  var pattern = /%o/gim;

  return input.replace(pattern, handlePermille);
};