/* eslint-disable no-irregular-whitespace */
import ava from 'ava'

const entrypoints = [
  '../dist',
  '../src',
]

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F'
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

entrypoints.forEach(entrypoint => {
  const colon = require(entrypoint)

  ava('should do nothing with no param at all', t =>
    t.deepEqual(colon(), ''))

  ava('should do nothing if locale is undefined', t =>
    t.deepEqual(colon(`foo : bar`), `foo : bar`))

  ava('should ignore locale not in DB', t =>
    t.deepEqual(colon(`foo : bar`, american), `foo : bar`))

  ava('should handle fr[-*]', t => {
    t.deepEqual(colon(`foo : bar`, fr), `foo${chars['NARROW NO-BREAK SPACE']}: bar`)
    t.deepEqual(colon(`foo : bar`, frCH), `foo${chars['NARROW NO-BREAK SPACE']}: bar`)
  })
})
