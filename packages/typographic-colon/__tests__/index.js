/* eslint-disable no-irregular-whitespace */

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F'
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

const colon = require('../src')

test('should do nothing with no param at all', () => expect(colon()).toEqual(''))

test('should do nothing if locale is undefined', () =>
  expect(colon(`foo : bar`)).toEqual(`foo : bar`))

test('should ignore locale not in DB', () =>
  expect(colon(`foo : bar`, american)).toEqual(`foo : bar`))

test('should handle fr[-*]', () => {
  expect(colon(`foo : bar`, fr)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}: bar`)
  expect(colon(`foo : bar`, frCH)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}: bar`)
})
