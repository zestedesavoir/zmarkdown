import semiColon from '../src/'

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F',
  'LEFT-POINTING ANGLE QUOTATION MARK': '\u00AB',
  'RIGHT-POINTING ANGLE QUOTATION MARK': '\u00BB',
}

const american = {locale: 'en-us'}
const fr = {locale: 'fr'}
const frCH = {locale: 'fr-sw'}


test('should do nothing with no param at all', () => expect(semiColon()).toEqual(''))

test('should do nothing if locale is undefined', () =>
  expect(semiColon(`<< a >>`)).toEqual(`<< a >>`))

test('should ignore locale not in DB', () =>
  expect(semiColon(`<< a >>`, american)).toEqual(`<< a >>`))

test('should handle fr[-*]', () => {
  const before = `${chars['LEFT-POINTING ANGLE QUOTATION MARK']}${chars['NARROW NO-BREAK SPACE']}`
  const after = `${chars['NARROW NO-BREAK SPACE']}${chars['RIGHT-POINTING ANGLE QUOTATION MARK']}`
  expect(semiColon(`<< a >>`, fr)).toEqual(`${before}a${after}`)
  expect(semiColon(`<< a >>`, frCH)).toEqual(`${before}a${after}`)
})
