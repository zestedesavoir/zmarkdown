const db = require('./db')

module.exports = (input = '', { locale } = {}) => {
  if (!Object.keys(db).includes(locale)) return input

  const chars = db[locale]
  const leftMark = chars['LEFT-POINTING ANGLE QUOTATION MARK']
  const rightMark = chars['RIGHT-POINTING ANGLE QUOTATION MARK']
  const spaceChar = chars['NARROW NO-BREAK SPACE']

  const leftAnglePattern = /<<\s*/gm
  const rightAnglePattern = /\s*>>/gm

  return input
    .replace(leftAnglePattern, leftMark.concat(spaceChar))
    .replace(rightAnglePattern, spaceChar.concat(rightMark))
}
