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

const entrypoints = [
  '../dist',
  '../src',
]

entrypoints.forEach(entrypoint => {
  const plugin = require(entrypoint)

  test('config', () => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(remark2rehype)
      .use(plugin, 'Foo bar $id')
      .use(stringify)
      .processSync(specs['config'].fixture)

    expect(contents).toEqual(specs['config'].expected.trim())
  })

  test('config2', () => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(remark2rehype)
      .use(plugin, 'Baz $id qux?')
      .use(stringify)
      .processSync(specs['config2'].fixture)

    expect(contents).toEqual(specs['config2'].expected.trim())
  })

  test('noconfig', () => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(remark2rehype)
      .use(plugin)
      .use(stringify)
      .processSync(specs['noconfig'].fixture)

    expect(contents).toEqual(specs['noconfig'].expected.trim())
  })
})
