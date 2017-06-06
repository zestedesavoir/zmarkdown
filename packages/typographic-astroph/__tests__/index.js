/* eslint-disable no-irregular-whitespace */
import ava from 'ava'

const entrypoints = [
  '../dist',
  '../src',
]

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

entrypoints.forEach(entrypoint => {
  const apos = require(entrypoint)

  ava('should do nothing if locale is undefined', t =>
    t.deepEqual(apos(`I'm`), `I'm`))

  ava('should ignore locale not in DB', t =>
    t.deepEqual(apos(`I'm`, american), `I'm`))

  ava('should handle fr[-*]', t => {
    t.deepEqual(apos(`I'm`, fr), `I’m`)
    t.deepEqual(apos(`I'm`, frCH), `I’m`)
  })
})
