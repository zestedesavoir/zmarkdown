/* eslint-disable no-console */
import {readdirSync as directory, readFileSync as file, lstatSync as stat} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
import remarkMath from 'remark-math'
import rebber from 'rebber'
import dedent from 'dedent'

const base = join(__dirname, 'fixtures')
const fixtures = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  if (!tests[parts[0]]) {
    tests[parts[0]] = {}
  }
  if (stat(join(base, contents)).isFile()) {
    tests[parts[0]] = file(join(base, contents), 'utf-8')
  }
  return tests
}, {})

const emoticons = {
  ':)': 'smile',
}

const integrationConfig = {
  preprocessors: {
    tableCell: require('../src/preprocessors/codeVisitor'),
    iframe: require('../src/preprocessors/iframe'),
  },
  overrides: {
    abbr: require('../src/type/abbr'),
    centerAligned: require('../src/type/align'),
    emoticon: require('../src/type/emoticon'),
    errorCustomBlock: require('../src/type/customBlocks'),
    figure: require('../src/type/figure'),
    gridTable: require('../src/type/gridTable'),
    informationCustomBlock: require('../src/type/customBlocks'),
    inlineMath: require('../src/type/math'),
    kbd: require('../src/type/kbd'),
    leftAligned: require('../src/type/align'),
    math: require('../src/type/math'),
    neutreCustomBlock: require('../src/type/customBlocks'),
    questionCustomBlock: require('../src/type/customBlocks'),
    rightAligned: require('../src/type/align'),
    secretCustomBlock: require('../src/type/customBlocks'),
    sub: require('../src/type/sub'),
    sup: require('../src/type/sup'),
    tableHeader: require('../src/type/tableHeader'),
    warningCustomBlock: require('../src/type/customBlocks'),
  },
  emoticons: emoticons,
  codeAppendiceTitle: 'Annexes',
  customBlocks: {
    map: {
      secret: 'FooBar',
    },
  },
  image: {
    inlineImage: (node) => `\\inlineImage{${node.url}}`,
    image: (node) => `\\image{${node.url}}`,
  },
  figure: {
    image: (_, caption, extra) => `\\image{${extra.url}}${caption ? `[${caption}]` : ''}\n`,
  },
}

integrationConfig.overrides.eCustomBlock = (ctx, node) => {
  node.type = 'errorCustomBlock'
  return integrationConfig.overrides.warningCustomBlock(ctx, node)
}
integrationConfig.overrides.iCustomBlock = (ctx, node) => {
  node.type = 'informationCustomBlock'
  return integrationConfig.overrides.informationCustomBlock(ctx, node)
}
integrationConfig.overrides.qCustomBlock = (ctx, node) => {
  node.type = 'questionCustomBlock'
  return integrationConfig.overrides.questionCustomBlock(ctx, node)
}
integrationConfig.overrides.sCustomBlock = (ctx, node) => {
  node.type = 'secretCustomBlock'
  return integrationConfig.overrides.secretCustomBlock(ctx, node)
}
integrationConfig.overrides.aCustomBlock = (ctx, node) => {
  node.type = 'warningCustomBlock'
  return integrationConfig.overrides.warningCustomBlock(ctx, node)
}

test('heading', () => {
  const fixture = fixtures['heading']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(fixture)

  expect(contents).toMatchSnapshot()
})

test('html nodes', () => {
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(dedent`
      # foo
      **something <a> else**
    `)

  expect(contents).toMatchSnapshot()
})

test('heading with custom config', () => {
  const fixture = fixtures['heading']
  const {contents} = unified()
    .use(reParse)
    .use(rebber, {
      headings: [
        (val) => `\\LevelOneTitle{${val}}\n`,
        (val) => `\\LevelTwoTitle{${val}}\n`,
        (val) => `\\LevelThreeTitle{${val}}\n`,
        (val) => `\\LevelFourTitle{${val}}\n`,
        (val) => `\\LevelFiveTitle{${val}}\n`,
        (val) => `\\LevelSixTitle{${val}}\n`,
        (val) => `\\LevelSevenTitle{${val}}\n`,
      ],
    })
    .processSync(fixture)

  expect(contents).toMatchSnapshot()
})

test('paragraph', () => {
  const fixture = fixtures['paragraph']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('inline-code', () => {
  const fixture = fixtures['inline-code']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('emoticon', () => {
  const fixture = fixtures['emoticon']
  const {contents} = unified()
    .use(reParse)
    .use(require('remark-emoticons/src'), {emoticons})
    .use(rebber, {
      overrides: {
        emoticon: require('../src/type/emoticon'),
      },
      emoticons: emoticons,
    })
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('table', () => {
  const fixture = fixtures['table']
  const {contents} = unified()
    .use(reParse)
    .use(rebber, {})
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('blockquote', () => {
  const fixture = fixtures['blockquote']
  let compiled = unified()
    .use(reParse)
    .use(rebber)
    .processSync(fixture)

  expect(compiled.contents.trim()).toMatchSnapshot()

  compiled = unified()
    .use(reParse)
    .use(rebber, {
      blockquote: undefined,
    })
    .processSync(fixture)

  expect(compiled.contents.trim()).toMatchSnapshot()
})

test('blockquote with custom config', () => {
  const fixture = fixtures['blockquote']
  const {contents} = unified()
    .use(reParse)
    .use(rebber, {
      blockquote: (val) => `\\begin{Foo}\n${val}\n\\end{Foo}\n\n`,
    })
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('figure+caption', () => {
  const fixture = fixtures['figure']
  const {contents} = unified()
    .use(reParse)
    .use(require('remark-captions/src'))
    .use(rebber, {
      overrides: {
        figure: require('../src/type/figure'),
      },
    })
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('code', () => {
  const fixture = fixtures['code']
  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('code+caption', () => {
  const fixture = fixtures['figure-code']

  const {contents} = unified()
    .use(reParse)
    .use(require('remark-captions/src'))
    .use(rebber, {
      overrides: {
        figure: require('../src/type/figure'),
      },
    })
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('list', () => {
  const fixture = fixtures['list']

  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

test('link', () => {
  const fixture = fixtures['link']

  const {contents} = unified()
    .use(reParse)
    .use(rebber)
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
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
  const fixture = fixtures['link-prepend']

  const {contents} = unified()
    .use(reParse)
    .use(rebber, {
      link: {
        prefix: 'http://zestedesavoir.com',
      },
    })
    .processSync(fixture)

  expect(contents.trim()).toMatchSnapshot()
})

Object.keys(fixtures).filter(Boolean).filter(name => name.startsWith('mix-')).forEach(name => {
  const fixture = fixtures[name]

  test(name, () => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true,
      })
      .use(require('remark-emoticons/src'), {emoticons})
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
            id: '.+/(.+)$',
          },
          removeAfter: '&',
        }})
      .use(require('remark-kbd/src'))
      .use(require('remark-abbr/src'))
      .use(require('remark-align/src'), {
        right: 'custom-right',
        center: 'custom-center',
      })
      .use(rebber, integrationConfig)
      .processSync(fixture.replace(/·/g, ' '))

    expect(contents.trim()).toMatchSnapshot()
  })
})

test('footnotes', () => {
  const {contents} = unified()
    .use(reParse, {footnotes: true})
    .use(rebber, integrationConfig)
    .processSync(dedent`
      # mytitle A[^footnoteRef]

      [^footnoteRef]: reference in title

      # mytitle B[^footnoterawhead inner]

      # myti*tle C[^foo inner]*

      a paragraph[^footnoteRawPar inner]
    `)
  expect(contents).toMatchSnapshot()
})

test('abbr', () => {
  const {contents} = unified()
    .use(reParse)
    .use(require('remark-abbr/src'))
    .use(rebber, {
      overrides: {
        abbr: require('../src/type/abbr'),
      },
    })
    .processSync(dedent`
      FOO

      *[FOO]: bar
    `)
  expect(contents).toMatchSnapshot()
})

test('abbr with custom config', () => {
  const {contents} = unified()
    .use(reParse)
    .use(require('remark-abbr/src'))
    .use(rebber, {
      overrides: {
        abbr: require('../src/type/abbr'),
      },
      abbr: (x) => `->${x}<-`,
    })
    .processSync(dedent`
      FOO

      *[FOO]: bar
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
  const fixture = fixtures['blocks']

  const {contents} = unified()
    .use(reParse)
    .use(require('remark-custom-blocks'), {
      secret: {
        classes: 'spoiler',
      },
      s: {
        classes: 'spoiler',
      },
      information: {
        classes: 'information ico-after',
      },
      i: {
        classes: 'information ico-after',
      },
      question: {
        classes: 'question ico-after',
      },
      q: {
        classes: 'question ico-after',
      },
      attention: {
        classes: 'warning ico-after',
      },
      a: {
        classes: 'warning ico-after',
      },
      erreur: {
        classes: 'error ico-after',
      },
      e: {
        classes: 'error ico-after',
        title: 'optional',
      },
      neutre: {
        classes: 'custom-block-neutre',
        title: 'required',
      },
    }, true)
    .use(rebber, integrationConfig)
    .processSync(fixture.replace(/·/g, ' '))

  expect(contents.trim()).toMatchSnapshot()
})

test('regression: code block without language', () => {
  const {contents} = unified()
    .use(reParse)
    .use(rebber, integrationConfig)
    .processSync(dedent`
      \`\`\`
      a
      \`\`\`
    `)

  expect(contents).toMatchSnapshot()
})

// TODO: fix this?
test.skip('comments blocks', () => {
  const {contents} = unified()
    .use(reParse)
    .use(rebber, integrationConfig)
    .processSync(dedent`
      Foo<--COMMENTS I am a comment COMMENTS-->bar
    `)

  expect(contents).toMatch('begin{comment}')
})
