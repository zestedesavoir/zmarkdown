import emDash from '../src/'

const chars = {
  'NARROW NO-BREAK SPACE': '\u202F',
  'EM DASH': '\u2014',
}

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

const nnbs = chars['NARROW NO-BREAK SPACE']
const dashChar = chars['EM DASH']

test('should do nothing with no param at all', () => expect(emDash()).toEqual(''))

test('should only replace em dash if the locale is not in db', () => {
  expect(emDash(`--foo bar--`)).toEqual(`${dashChar}foo bar${dashChar}`)
  expect(emDash(`--foo bar--`, american)).toEqual(`${dashChar}foo bar${dashChar}`)
})

test('should alse replace space for fr[-*]', () => {
  expect(emDash(`-- foo`, fr)).toEqual(`${dashChar}${nnbs}foo`)
  expect(emDash(` -- foo -- bar -- foo bar --`, fr)).toEqual(
    ` ${dashChar}${nnbs}foo${nnbs}${dashChar} bar ${dashChar}${nnbs}foo bar${nnbs}${dashChar}`
  )
  expect(emDash(` -- foo -- bar -- foo bar --`, frCH)).toEqual(
    ` ${dashChar}${nnbs}foo${nnbs}${dashChar} bar ${dashChar}${nnbs}foo bar${nnbs}${dashChar}`
  )
})
