import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import ava from 'ava'
import unified from 'unified'
import reParse from 'remark-parse'
import rehypeStringify from 'rehype-stringify'
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

  ava('subsuper', t => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin)
      .use(rehypeStringify)
      .processSync(specs['subsuper'].fixture)

    t.deepEqual(contents, specs['subsuper'].expected.trim())
  })

  ava('regression-1', t => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin)
      .use(rehypeStringify)
      .processSync(specs['regression-1'].fixture)

    t.deepEqual(contents, specs['regression-1'].expected.trim())
  })
})
