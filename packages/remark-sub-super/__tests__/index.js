import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
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

Object.keys(specs).forEach(name => {
  entrypoints.forEach(entrypoint => {
    const plugin = require(entrypoint)

    test(name, () => {
      const {contents} = unified()
        .use(reParse)
        .use(remark2rehype)
        .use(plugin)
        .use(rehypeStringify)
        .processSync(specs[name].fixture)

      expect(contents).toEqual(specs[name].expected.trim())
    })
  })
})
