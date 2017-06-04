import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import ava from 'ava'
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

  ava('config', t => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(remark2rehype)
      .use(plugin, 'Foo bar $id')
      .use(stringify)
      .processSync(specs['config'].fixture)

    t.deepEqual(contents, specs['config'].expected.trim())
  })

  ava('config2', t => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(remark2rehype)
      .use(plugin, 'Baz $id qux?')
      .use(stringify)
      .processSync(specs['config2'].fixture)

    t.deepEqual(contents, specs['config2'].expected.trim())
  })

  ava('noconfig', t => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(remark2rehype)
      .use(plugin)
      .use(stringify)
      .processSync(specs['noconfig'].fixture)

    t.deepEqual(contents, specs['noconfig'].expected.trim())
  })
})
