/* eslint-disable no-irregular-whitespace */
import ava from 'ava'

const entrypoints = [
  '../dist',
  '../src',
]

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F',
  'PER MILLE SIGN': '\u2030'
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

entrypoints.forEach(entrypoint => {
  const permille = require(entrypoint)

  ava('should do nothing with no param at all', t =>
    t.deepEqual(permille(), ''))

  ava('should handle all locales', t => {
    t.deepEqual(permille(`foo %o`), `foo ${chars['PER MILLE SIGN']}`)
    t.deepEqual(permille(`foo %o`, american), `foo ${chars['PER MILLE SIGN']}`)
    t.deepEqual(permille(`foo %o`, american), `foo ${chars['PER MILLE SIGN']}`)
    t.deepEqual(permille(`%o`, american), `${chars['PER MILLE SIGN']}`)
  })

  ava('should handle fr[-*]', t => {
    t.deepEqual(permille(`foo %o`, fr),
    `foo${chars['NARROW NO-BREAK SPACE']}${chars['PER MILLE SIGN']}`)
    t.deepEqual(permille(`foo %o`, frCH),
    `foo${chars['NARROW NO-BREAK SPACE']}${chars['PER MILLE SIGN']}`)
    t.deepEqual(permille(`%o`, fr), `${chars['PER MILLE SIGN']}`)
  })
})
