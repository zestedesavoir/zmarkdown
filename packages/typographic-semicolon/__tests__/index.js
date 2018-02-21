import semiColon from '../src/'

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F',
}

const american = {locale: 'en-us'}
const fr = {locale: 'fr'}
const frCH = {locale: 'fr-sw'}

test('should do nothing with no param at all', () => expect(semiColon()).toEqual(''))

test('should do nothing if locale is undefined', () =>
  expect(semiColon(`foo ; bar`)).toEqual(`foo ; bar`))

test('should ignore locale not in DB', () =>
  expect(semiColon(`foo ; bar`, american)).toEqual(`foo ; bar`))

test('should handle fr[-*]', () => {
  expect(semiColon(`foo ; bar`, fr)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}; bar`)
  expect(semiColon(`foo ; bar`, frCH)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}; bar`)
})
