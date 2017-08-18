/* eslint-disable no-console */
import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import dedent from 'dedent'
import remarkConfig from '../remark-config'
import rebberConfig from '../rebber-config'

remarkConfig.noTypography = true
remarkConfig.ping.pingUsername = () => false

const zmarkdown = require('../')

const renderString = (config = {remarkConfig, rebberConfig}) =>
  (input) =>
    zmarkdown(config, 'latex').renderString(input)

const base = join(__dirname, 'fixtures/latex')
const fixtures = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  tests[parts[0]] = file(join(base, contents), 'utf-8')
  return tests
}, {})

test('heading', () => {
  const fixture = fixtures['heading']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('html nodes', () => {
  const {content} = renderString()(dedent`
    # foo
    **something <a> else**
  `)

  expect(content).toMatchSnapshot()
})

test('heading with custom config', () => {
  const fixture = fixtures['heading']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('paragraph', () => {
  const fixture = fixtures['paragraph']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('inline-code', () => {
  const fixture = fixtures['inline-code']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('emoticon', () => {
  const fixture = fixtures['emoticon']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('table', () => {
  const fixture = fixtures['table']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('blockquote', () => {
  const fixture = fixtures['blockquote']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('blockquote with custom config', () => {
  const fixture = fixtures['blockquote']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('figure+caption', () => {
  const fixture = fixtures['figure']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('code', () => {
  const fixture = fixtures['code']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('code+caption', () => {
  const fixture = fixtures['figure-code']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('list', () => {
  const fixture = fixtures['list']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('link', () => {
  const fixture = fixtures['link']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

test('link with special characters', () => {
  const {content} = renderString()(dedent`
    [foo](http://example.com?a=b%c^{}#foo)
  `)

  expect(content).toMatchSnapshot()
})

test('link-prepend', () => {
  const fixture = fixtures['link-prepend']
  const {content} = renderString()(fixture)

  expect(content).toMatchSnapshot()
})

Object.keys(fixtures).filter(Boolean).filter(name => name.startsWith('mix-')).forEach(name => {
  const fixture = fixtures[name]

  test(name, () => {
    const {content} = renderString()(fixture.replace(/·/g, ' '))

    expect(content).toMatchSnapshot()
  })
})

test('footnotes', () => {
  const {content} = renderString()(dedent`
    # mytitle A[^footnoteRef]

    [^footnoteRef]: reference in title

    # mytitle B[^footnoterawhead inner]

    # myti*tle C[^foo inner]*

    a paragraph[^footnoteRawPar inner]
  `)
  expect(content).toMatchSnapshot()
})

test('math', () => {
  const {content} = renderString()(dedent`
    A sentence ($S$) with *italic* and inline math ($C_L$) and $$b$$ another.

    $$
    L = \frac{1}{2} \rho v^2 S C_L
    $$

    hehe
  `)
  expect(content).toMatchSnapshot()
})

test('custom-blocks', () => {
  const fixture = fixtures['blocks']
  const {content} = renderString()(fixture.replace(/·/g, ' '))

  expect(content).toMatchSnapshot()
})

test('regression: code block without language', () => {
  const {content} = renderString()(dedent`
    \`\`\`
    a
    \`\`\`
  `)

  expect(content).toMatchSnapshot()
})
