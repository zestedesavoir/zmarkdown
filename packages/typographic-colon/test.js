const colon = require('./index')
const { equal } = require('assert')

const american = { locale: 'en-us' }
const fr = { locale: 'fr' }
const frCH = { locale: 'fr-sw' }

it('should do nothing if locale is undefined', () =>
  equal(colon(`foo : bar`), `foo : bar`))

it('should ignore locale not in DB', () =>
  equal(colon(`foo : bar`, american), `foo : bar`))

it('should handle fr[-*]', () => {
  equal(colon(`foo : bar`, fr), `foo : bar`) // eslint-disable-line no-irregular-whitespace
  equal(colon(`foo : bar`, frCH), `foo : bar`) // eslint-disable-line no-irregular-whitespace
})
