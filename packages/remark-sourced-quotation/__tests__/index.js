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

  Object.keys(specs).filter(Boolean).forEach(name => {
    const spec = specs[name]

    ava.skip(name, t => {
      const {contents} = unified()
        .use(reParse, {
          gfm: true,
          commonmark: false,
          yaml: false,
          footnotes: true,
          /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
          &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
          blocks: [],
        })
        .use(plugin)
        .use(remark2rehype)
        .use(stringify)
        .processSync(spec.fixture)

      t.deepEqual(contents, spec.expected.trim())
    })
  })
})
