/* eslint-disable no-irregular-whitespace */
import ava from 'ava'

const entrypoints = [
  '../dist',
  '../src',
]

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F',
  'EM DASH': '\u2014',
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

entrypoints.forEach(entrypoint => {
  const emDash = require(entrypoint)
  const nnbs = chars['NARROW NO-BREAK SPACE']
  const dashChar = chars['EM DASH']

  ava('should do nothing with no param at all', t =>
    t.deepEqual(emDash(), ''))

  ava('should only replace em dash if the locale is not in db', t => {
    t.deepEqual(emDash(`--foo bar--`), `${dashChar}foo bar${dashChar}`)
    t.deepEqual(emDash(`--foo bar--`, american), `${dashChar}foo bar${dashChar}`)
  })

  ava('should alse replace space for fr[-*]', t => {
    t.deepEqual(emDash(`-- foo`, fr), `${dashChar}${nnbs}foo`)
    t.deepEqual(emDash(` -- foo -- bar -- foo bar --`, fr),
    ` ${dashChar}${nnbs}foo${nnbs}${dashChar} bar ${dashChar}${nnbs}foo bar${nnbs}${dashChar}`)
    t.deepEqual(emDash(` -- foo -- bar -- foo bar --`, fr),
    ` ${dashChar}${nnbs}foo${nnbs}${dashChar} bar ${dashChar}${nnbs}foo bar${nnbs}${dashChar}`)
  })
})
