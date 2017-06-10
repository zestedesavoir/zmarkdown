const db = require('./db')

module.exports = (input = '', { locale } = {}) => {
  if (!Object.keys(db).includes(locale)) return input

  const handlePermille = db[locale]

  const pattern = /%o/gim

  return input.replace(pattern, handlePermille)
}
