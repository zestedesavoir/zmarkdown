import exclamationMark from '../src/'

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F'
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

test('should do nothing with no param at all', () => expect(exclamationMark()).toEqual(''))

test('should do nothing if locale is undefined', () =>
  expect(exclamationMark(`foo ! bar`)).toEqual(`foo ! bar`))

test('should ignore locale not in DB', () =>
  expect(exclamationMark(`foo ! bar`, american)).toEqual(`foo ! bar`))

test('should handle fr[-*]', () => {
  expect(exclamationMark(`foo ! bar`, fr)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}! bar`)
  expect(exclamationMark(`foo ! bar`, frCH)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}! bar`)
})
