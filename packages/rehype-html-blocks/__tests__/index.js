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

  Object.keys(specs).filter(Boolean).filter(name => !name.endsWith('-without')).forEach(name => {
    const spec = specs[name]

    ava(name, t => {
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
        .use(remark2rehype, { allowDangerousHTML: true })
        .use(plugin)
        .use(rehypeStringify)
        .processSync(spec.fixture)

      t.deepEqual(contents, spec.expected.trim())
    })
  })


  Object.keys(specs).filter(Boolean).filter(name => !name.endsWith('-without')).forEach(name => {
    const spec = specs[name]

    ava(name, t => {
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
        .use(remark2rehype, { allowDangerousHTML: true })
        // .use(plugin)
        .use(rehypeStringify)
        .processSync(spec.fixture)

      t.deepEqual(contents, specs[`${name}-without`].expected.trim())
    })
  })
})
