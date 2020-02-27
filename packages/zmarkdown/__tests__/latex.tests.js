/* eslint-disable no-console */
const directory = require('fs').readdirSync
const file = require('fs').readFileSync
const {join} = require('path')
const dedent = require('dedent')
const remarkConfig = require('../config/remark')
const rebberConfig = require('../config/rebber')

remarkConfig.noTypography = true
remarkConfig._test = true

const zmarkdown = require('../server')

const renderString = (config = {remarkConfig, rebberConfig}) =>
  (input) =>
    zmarkdown(config, 'latex').renderString(input).then((vfile) =>
      vfile.toString().trim())

const base = join(__dirname, 'fixtures/latex')
const fixtures = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  tests[parts[0]] = file(join(base, contents), 'utf-8')
  return tests
}, {})

test('heading', () => {
  const fixture = fixtures['heading']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('html nodes', () => {
  const p = renderString()(dedent`
    # foo
    **something <a> else**
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('heading with custom config', () => {
  const fixture = fixtures['heading']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('paragraph', () => {
  const fixture = fixtures['paragraph']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('inline-code', () => {
  const fixture = fixtures['inline-code']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('emoticon', () => {
  const fixture = fixtures['emoticon']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('table', () => {
  const fixture = fixtures['table']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('blockquote', () => {
  const fixture = fixtures['blockquote']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('blockquote with custom config', () => {
  const fixture = fixtures['blockquote']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('figure+caption', () => {
  const fixture = fixtures['figure']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('code', () => {
  const fixture = fixtures['code']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('code+caption', () => {
  const fixture = fixtures['figure-code']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('list', () => {
  const fixture = fixtures['list']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('link', () => {
  const fixture = fixtures['link']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

test('link with special characters', () => {
  const p = renderString()(dedent`
    [foo](http://example.com?a=b%c^{}#foo)
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('link-prepend', () => {
  const fixture = fixtures['link-prepend']
  const p = renderString()(fixture)

  return expect(p).resolves.toMatchSnapshot()
})

Object.keys(fixtures).filter(Boolean).filter(name => name.startsWith('mix-')).forEach(name => {
  const fixture = fixtures[name]

  test(name, () => {
    const p = renderString()(fixture.replace(/·/g, ' '))

    return expect(p).resolves.toMatchSnapshot()
  })
})

test('footnotes', () => {
  const p = renderString()(dedent`
    # mytitle A[^footnoteRef]

    [^footnoteRef]: reference in title

    # mytitle B[^footnoterawhead inner]

    # myti*tle C[^foo inner]*

    a paragraph[^footnoteRawPar inner]
  `)
  return expect(p).resolves.toMatchSnapshot()
})

test('math', () => {
  const p = renderString()(dedent`
    A sentence ($S$) with *italic* and inline math ($C_L$) and $$b$$ another.

    $$
    L = \frac{1}{2} \rho v^2 S C_L
    $$

    hehe
  `)
  return expect(p).resolves.toMatchSnapshot()
})

test('ping', () => {
  const p = renderString()(dedent`
      Hello @you and @you_too, and @**also you**
    `)
  return expect(p).resolves.toMatchSnapshot()
})

test('custom-blocks', () => {
  const fixture = fixtures['blocks']
  const p = renderString()(fixture.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('regression: code block without language', () => {
  const p = renderString()(dedent`
    \`\`\`
    a
    \`\`\`
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('properly loads extensions - mhchem', () => {
  const markdown = '$\\ce{H2O}$'
  const result = renderString()(markdown)

  return expect(result).resolves.toContain(markdown)
})

test('codes in notes', () => {
  const fixture = fixtures['code-inside-notes']
  const p = renderString()(fixture.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})
