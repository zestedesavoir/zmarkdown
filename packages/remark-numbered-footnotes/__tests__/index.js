import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
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

const config = {
  gfm: true,
  commonmark: false,
  footnotes: true
}

test('footnotes', () => {
  const {contents} = unified()
    .use(reParse, config)
    .use(require('../src'))
    .use(remark2rehype)
    .use(stringify)
    .processSync(specs['footnotes'].fixture)

  expect(contents).toMatchSnapshot()
})

test('regression-1', () => {
  const {contents} = unified()
    .use(reParse, config)
    .use(require('../src'))
    .use(remark2rehype)
    .use(stringify)
    .processSync(specs['regression-1'].fixture)

  expect(contents).toMatchSnapshot()
})
