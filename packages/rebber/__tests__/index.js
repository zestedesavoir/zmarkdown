/* eslint-disable no-console */
import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
import remarkMath from 'remark-math'
import rebber from '../src'
import dedent from 'dedent'

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
    kbd: require('../src/custom-types/kbd'),
    CenterAligned: require('../src/custom-types/align'),
    RightAligned: require('../src/custom-types/align'),
    errorCustomBlock: require('../src/custom-types/customBlocks'),
    informationCustomBlock: require('../src/custom-types/customBlocks'),
    questionCustomBlock: require('../src/custom-types/customBlocks'),
    secretCustomBlock: require('../src/custom-types/customBlocks'),
    warningCustomBlock: require('../src/custom-types/customBlocks'),
    gridTable: require('../src/custom-types/gridTable'),
    abbr: require('../src/custom-types/abbr'),
    math: require('../src/custom-types/math'),
    inlineMath: require('../src/custom-types/math'),
  },
  emoticons: emoticons,
  codeAppendiceTitle: 'Annexes',
}

integrationConfig.override.eCustomBlock = (ctx, node) => {
  node.type = 'errorCustomBlock'
  return integrationConfig.override.warningCustomBlock(ctx, node)
}
integrationConfig.override.iCustomBlock = (ctx, node) => {
  node.type = 'informationCustomBlock'
  return integrationConfig.override.informationCustomBlock(ctx, node)
}
integrationConfig.override.qCustomBlock = (ctx, node) => {
  node.type = 'questionCustomBlock'
  return integrationConfig.override.questionCustomBlock(ctx, node)
}
integrationConfig.override.sCustomBlock = (ctx, node) => {
  node.type = 'secretCustomBlock'
  return integrationConfig.override.secretCustomBlock(ctx, node)
}
integrationConfig.override.aCustomBlock = (ctx, node) => {
  node.type = 'warningCustomBlock'
  return integrationConfig.override.warningCustomBlock(ctx, node)
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
    .use(require('remark-emoticons/src'), emoticons)
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
    .use(require('remark-captions/src'))
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
    .use(require('remark-captions/src'))
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

test('link with special characters', () => {
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(dedent`
      [foo](http://example.com?a=b%c^{}#foo)
    `)

  expect(contents.trim()).toMatchSnapshot()
})

test('link-prepend', () => {
  const spec = specs['link-prepend']

  const {contents} = unified()
    .use(reParse)
    .use(rebber, {
      link: {
        prefix: 'http://zestedesavoir.com',
      },
    })
    .processSync(spec.fixture)

  expect(contents.trim()).toEqual(spec.expected.trim())
})

Object.keys(specs).filter(Boolean).filter(name => name.startsWith('mix-')).forEach(name => {
  const spec = specs[name]

  test(name, () => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(require('remark-emoticons/src'), emoticons)
      .use(require('remark-captions/src'), {external: {gridTable: 'Table:', math: 'Equation'},
        internal: {iframe: 'Video:'}})
      .use(require('remark-grid-tables/src'))
      .use(require('remark-sub-super/src'))
      .use(require('remark-iframes/src'), {
        'www.youtube.com': {
          tag: 'iframe',
          width: 560,
          height: 315,
          disabled: false,
          replace: [
            ['watch?v=', 'embed/'],
            ['http://', 'https://'],
          ],
          thumbnail: {
            format: 'http://img.youtube.com/vi/{id}/0.jpg',
            id: '.+/(.+)$'
          },
          removeAfter: '&'
        }})
      .use(require('remark-kbd/src'))
      .use(require('remark-abbr/src'))
      .use(require('remark-align/src'), {
        right: 'custom-right',
        center: 'custom-center',
      })
      .use(rebber, integrationConfig)
      .processSync(spec.fixture.replace(/·/g, ' '))

    expect(contents.trim()).toMatchSnapshot()
  })
})

test('footnotes', () => {
  const {contents} = unified()
    .use(reParse, {footnotes: true})
    .use(rebber, integrationConfig)
    .processSync(dedent`
      # mytitle[^footnoteRef]

      [^fotnoteRef]: reference in title

      # mytitle[^footnoterawhead inner]

      # myti*tle[^foo inner]*

      a paragraph[^footnoteRawPar inner]
    `)
  expect(contents).toMatchSnapshot()
})

test('math', () => {
  const {contents} = unified()
    .use(reParse)
    .use(remarkMath)
    .use(rebber, integrationConfig)
    .processSync(dedent`
      A sentence ($S$) with *italic* and inline math ($C_L$) and $$b$$ another.

      $$
      L = \frac{1}{2} \rho v^2 S C_L
      $$

      hehe
    `)
  expect(contents).toMatchSnapshot()
})

test('custom-blocks', () => {
  const spec = specs['blocks']

  const {contents} = unified()
    .use(reParse)
    .use(require('remark-custom-blocks'), {
      secret: 'spoiler',
      s: 'spoiler',
      information: 'information ico-after',
      i: 'information ico-after',
      question: 'question ico-after',
      q: 'question ico-after',
      attention: 'warning ico-after',
      a: 'warning ico-after',
      erreur: 'error ico-after',
      e: 'error ico-after',
    })
    .use(rebber, integrationConfig)
    .processSync(spec.fixture.replace(/·/g, ' '))

  expect(contents.trim()).toEqual(spec.expected.trim())
})
