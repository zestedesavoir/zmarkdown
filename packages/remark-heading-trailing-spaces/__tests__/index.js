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

  ava('with plugin', t => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin)
      .use(rehypeStringify)
      .processSync(specs['headings'].fixture.replace(/·/g, ' '))

    t.deepEqual(contents, specs['headings'].expected.trim())
  })

  ava('without', t => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(rehypeStringify)
      .processSync(specs['headings'].fixture.replace(/·/g, ' '))

    t.deepEqual(contents, specs['without'].expected.trim())
  })
})
