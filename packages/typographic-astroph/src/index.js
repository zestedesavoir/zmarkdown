const db = require('./db')

module.exports = (input = '', { locale } = {}) => {
  if (!Object.keys(db).includes(locale)) return input

  return input.replace("'", db[locale])
}
