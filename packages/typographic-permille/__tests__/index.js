/* eslint-disable no-irregular-whitespace */
const entrypoints = [
  '../dist',
  '../src',
];

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F',
  'PER MILLE SIGN': '\u2030'
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

entrypoints.forEach(entrypoint => {
  const permille = require(entrypoint)

  test('should do nothing with no param at all', () => expect(permille()).toEqual(''))

  test('should handle all locales', () => {
    expect(permille(`foo %o`)).toEqual(`foo ${chars['PER MILLE SIGN']}`)
    expect(permille(`foo %o`, american)).toEqual(`foo ${chars['PER MILLE SIGN']}`)
    expect(permille(`foo %o`, american)).toEqual(`foo ${chars['PER MILLE SIGN']}`)
    expect(permille(`%o`, american)).toEqual(`${chars['PER MILLE SIGN']}`)
  })

  test('should handle fr[-*]', () => {
    expect(permille(`foo %o`, fr)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}${chars['PER MILLE SIGN']}`)
    expect(permille(`foo %o`, frCH)).toEqual(`foo${chars['NARROW NO-BREAK SPACE']}${chars['PER MILLE SIGN']}`)
    expect(permille(`%o`, fr)).toEqual(`${chars['PER MILLE SIGN']}`)
  })
})
