/* eslint-disable no-irregular-whitespace */
import ava from 'ava'

const entrypoints = [
  '../dist',
  '../src',
]

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F',
  'LEFT-POINTING ANGLE QUOTATION MARK': '\u00AB',
  'RIGHT-POINTING ANGLE QUOTATION MARK': '\u00BB'
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

entrypoints.forEach(entrypoint => {
  const semiColon = require(entrypoint)

  ava('should do nothing with no param at all', t =>
    t.deepEqual(semiColon(), ''))

  ava('should do nothing if locale is undefined', t =>
    t.deepEqual(semiColon(`<< a >>`), `<< a >>`))

  ava('should ignore locale not in DB', t =>
    t.deepEqual(semiColon(`<< a >>`, american), `<< a >>`))

  ava('should handle fr[-*]', t => {
    const before = `${chars['LEFT-POINTING ANGLE QUOTATION MARK']}${chars['NARROW NO-BREAK SPACE']}`
    const after = `${chars['NARROW NO-BREAK SPACE']}${chars['RIGHT-POINTING ANGLE QUOTATION MARK']}`
    t.deepEqual(semiColon(`<< a >>`, fr), `${before}a${after}`)
    t.deepEqual(semiColon(`<< a >>`, frCH), `${before}a${after}`)
  })
})
