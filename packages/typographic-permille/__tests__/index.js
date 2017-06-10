/* eslint-disable no-irregular-whitespace */
import ava from 'ava'

const entrypoints = [
  '../dist',
  '../src',
]

const chars = {
  'PER MILLE SIGN': '\u2030',
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

entrypoints.forEach(entrypoint => {
  const colon = require(entrypoint)

  ava('should do nothing with no param at all', t =>
    t.deepEqual(colon(), ''))

  ava('should do nothing if locale is undefined', t =>
    t.deepEqual(colon(`foo %o`), `foo %o`))

  ava('should ignore locale not in DB', t =>
    t.deepEqual(colon(`foo %o`, american), `foo %o`))

  ava('should handle fr[-*]', t => {
    t.deepEqual(colon(`foo %o`, fr), `foo ${chars['PER MILLE SIGN']}`)
    t.deepEqual(colon(`foo %o`, frCH), `foo ${chars['PER MILLE SIGN']}`)
    t.deepEqual(colon(`%o`, fr), `${chars['PER MILLE SIGN']}`)
  })
})
