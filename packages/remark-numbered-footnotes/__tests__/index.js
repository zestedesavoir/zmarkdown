import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
import footnotes from 'remark-footnotes'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

const base = join(__dirname, 'fixtures')
const specs = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  if (!tests[parts[0]]) {
    tests[parts[0]] = {}
  }
  tests[parts[0]][parts[1]] = file(join(base, contents), 'utf-8')
  return tests
}, {})


const configs = [
  {
    gfm: true,
    commonmark: false,
  },
  {
    gfm: false,
    commonmark: false,
  },
  {
    gfm: false,
    commonmark: true,
  },
  {
    gfm: true,
    commonmark: true,
  },
]

configs.forEach(config => {
  describe(JSON.stringify(config), () => {
    test('footnotes', () => {
      const {contents} = unified()
        .use(reParse, config)
        .use(footnotes, {inlineNotes: true})
        .use(require('../src'))
        .use(remark2rehype)
        .use(stringify)
        .processSync(specs['footnotes'].fixture)

      expect(contents).toMatchSnapshot()
    })

    test('regression-1', () => {
      const {contents} = unified()
        .use(reParse, config)
        .use(footnotes, {inlineNotes: true})
        .use(require('../src'))
        .use(remark2rehype)
        .use(stringify)
        .processSync(specs['regression-1'].fixture)

      expect(contents).toMatchSnapshot()
    })

    test('regression-2', () => {
      const {contents} = unified()
        .use(reParse, config)
        .use(footnotes, {inlineNotes: true})
        .use(require('../src'))
        .use(remark2rehype)
        .use(stringify)
        .processSync(specs['regression-2'].fixture)

      expect(contents).toMatchSnapshot()
    })

    test('footnote-split', () => {
      const {contents} = unified()
        .use(reParse, config)
        .use(footnotes, {inlineNotes: true})
        .use(require('../src'))
        .use(remark2rehype)
        .use(stringify)
        .processSync(specs['footnote-split'].fixture)

      expect(contents).toMatchSnapshot()
    })

    test('footnotes with customized labelTemplate', () => {
      const {contents} = unified()
        .use(reParse, config)
        .use(footnotes, {inlineNotes: true})
        .use(require('../src'), {labelPrefix: '[', labelSuffix: ']'})
        .use(remark2rehype)
        .use(stringify)
        .processSync(specs['footnotes'].fixture)

      expect(contents).toMatchSnapshot()
    })
  })
})
