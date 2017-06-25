/* eslint-disable no-console */
import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
import rebber from '../src'

const base = join(__dirname, 'fixtures')
const specs = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  if (!tests[parts[0]]) {
    tests[parts[0]] = {}
  }
  tests[parts[0]][parts[1]] = file(join(base, contents), 'utf-8')
  return tests
}, {})

const emoticons = {
  ':)': 'smile',
}

const integrationConfig = {
  override: {
    emoticon: require('../src/custom-types/emoticon'),
    figure: require('../src/custom-types/figure'),
    sub: require('../src/custom-types/sub'),
    sup: require('../src/custom-types/sup'),
  },
  emoticons: emoticons,
}

test('heading', () => {
  const spec = specs['heading']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(spec.fixture)

  expect(contents).toEqual(spec.expected)
})

test('heading with custom config', () => {
  const [fixture, expected] = [specs['heading'].fixture, specs['heading-config'].expected]
  const {contents} = unified()
    .use(reParse)
    .use(rebber, {
      heading: [
        (val) => `\\LevelOneTitle{${val}}\n`,
        (val) => `\\LevelTwoTitle{${val}}\n`,
        (val) => `\\LevelThreeTitle{${val}}\n`,
        (val) => `\\LevelFourTitle{${val}}\n`,
        (val) => `\\LevelFiveTitle{${val}}\n`,
        (val) => `\\LevelSixTitle{${val}}\n`,
        (val) => `\\LevelSevenTitle{${val}}\n`,
      ]
    })
    .processSync(fixture)

  expect(contents).toEqual(expected)
})

test('paragraph', () => {
  const spec = specs['paragraph']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('inline-code', () => {
  const spec = specs['inline-code']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('emoticon', () => {
  const spec = specs['emoticon']
  const {contents} = unified()
    .use(reParse)
    .use(require('remark-emoticons'), emoticons)
    .use(rebber, {
      override: {
        emoticon: require('../src/custom-types/emoticon'),
      },
      emoticons: emoticons
    })
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('table', () => {
  const spec = specs['table']
  const {contents} = unified()
    .use(reParse)
    .use(rebber, {})
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('blockquote', () => {
  const spec = specs['blockquote']
  let compiled = unified()
    .use(reParse)
    .use(rebber)
    .processSync(spec.fixture)

  expect(compiled.contents.trim()).toEqual(spec.expected.trim())

  compiled = unified()
    .use(reParse)
    .use(rebber, {
      blockquote: undefined
    })
    .processSync(spec.fixture)

  expect(compiled.contents.trim()).toEqual(spec.expected.trim())
})

test('blockquote with custom config', () => {
  const [fixture, expected] = [specs['blockquote'].fixture, specs['blockquote-config'].expected]
  const {contents} = unified()
    .use(reParse)
    .use(rebber, {
      blockquote: (val) => `\\begin{Foo}\n${val}\n\\end{Foo}\n\n`,
    })
    .processSync(fixture)

  expect(contents.trim()).toEqual(expected.trim())
})

test('figure+caption', () => {
  const spec = specs['figure']
  const {contents} = unified()
    .use(reParse)
    .use(require('remark-captions'))
    .use(rebber, {
      override: {
        figure: require('../src/custom-types/figure'),
      },
    })
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('code', () => {
  const spec = specs['code']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('code+caption', () => {
  const spec = specs['figure-code']

  const {contents} = unified()
    .use(reParse)
    .use(require('remark-captions'))
    .use(rebber, {
      override: {
        figure: require('../src/custom-types/figure'),
      },
    })
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('list', () => {
  const spec = specs['list']

  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})
test('link', () => {
  const spec = specs['link']

  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

test('link-prepend', () => {
  const spec = specs['link-prepend']

  const {contents} = unified()
    .use(reParse)
    .use(rebber, {
      override: {
        link: {prefix: 'http://zestedesavoir.com'}
      }
    })
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

Object.keys(specs).filter(Boolean).filter(name => name.startsWith('mix-')).forEach(name => {
  const spec = specs[name]

  test(name, () => {
    const {contents} = unified()
      .use(reParse)
      .use(require('remark-emoticons'), emoticons)
      .use(require('remark-captions'))
      .use(require('remark-sub-super'))
      .use(rebber, integrationConfig)
      .processSync(spec.fixture.replace(/·/g, ' '))

    if (contents.trim() !== spec.expected.trim()) console.log(contents)
    expect(contents.trim()).toEqual(spec.expected.trim())
  })
})
