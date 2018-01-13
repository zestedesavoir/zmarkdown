/* eslint-disable no-console */
import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import dedent from 'dedent'
import remarkConfig from '../config/remark'
import rebberConfig from '../config/rebber'

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
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('html nodes', () => {
  const {contents} = renderString()(dedent`
    # foo
    **something <a> else**
  `)

  expect(contents).toMatchSnapshot()
})

test('heading with custom config', () => {
  const fixture = fixtures['heading']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('paragraph', () => {
  const fixture = fixtures['paragraph']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('inline-code', () => {
  const fixture = fixtures['inline-code']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('emoticon', () => {
  const fixture = fixtures['emoticon']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('table', () => {
  const fixture = fixtures['table']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('blockquote', () => {
  const fixture = fixtures['blockquote']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('blockquote with custom config', () => {
  const fixture = fixtures['blockquote']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('figure+caption', () => {
  const fixture = fixtures['figure']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('code', () => {
  const fixture = fixtures['code']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('code+caption', () => {
  const fixture = fixtures['figure-code']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('list', () => {
  const fixture = fixtures['list']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('link', () => {
  const fixture = fixtures['link']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

test('link with special characters', () => {
  const {contents} = renderString()(dedent`
    [foo](http://example.com?a=b%c^{}#foo)
  `)

  expect(contents).toMatchSnapshot()
})

test('link-prepend', () => {
  const fixture = fixtures['link-prepend']
  const {contents} = renderString()(fixture)

  expect(contents).toMatchSnapshot()
})

Object.keys(fixtures).filter(Boolean).filter(name => name.startsWith('mix-')).forEach(name => {
  const fixture = fixtures[name]

  test(name, () => {
    const {contents} = renderString()(fixture.replace(/·/g, ' '))

    expect(contents).toMatchSnapshot()
  })
})

test('footnotes', () => {
  const {contents} = renderString()(dedent`
    # mytitle A[^footnoteRef]

    [^footnoteRef]: reference in title

    # mytitle B[^footnoterawhead inner]

    # myti*tle C[^foo inner]*

    a paragraph[^footnoteRawPar inner]
  `)
  expect(contents).toMatchSnapshot()
})

test('math', () => {
  const {contents} = renderString()(dedent`
    A sentence ($S$) with *italic* and inline math ($C_L$) and $$b$$ another.

    $$
    L = \frac{1}{2} \rho v^2 S C_L
    $$

    hehe
  `)
  expect(contents).toMatchSnapshot()
})

test('custom-blocks', () => {
  const fixture = fixtures['blocks']
  const {contents} = renderString()(fixture.replace(/·/g, ' '))

  expect(contents).toMatchSnapshot()
})

test('regression: code block without language', () => {
  const {contents} = renderString()(dedent`
    \`\`\`
    a
    \`\`\`
  `)

  expect(contents).toMatchSnapshot()
})
