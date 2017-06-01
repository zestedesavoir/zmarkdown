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

  ava('with', t => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin)
      .use(stringify)
      .processSync(specs['with'].fixture)

    t.deepEqual(contents, specs['with'].expected.trim())
  })

  ava('without', t => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(stringify)
      .processSync(specs['without'].fixture)

    t.deepEqual(contents, specs['without'].expected.trim())
  })

  ava('Errors with invalid config: []', t => {
    const fail = () => unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin, [])
      .use(stringify)
      .processSync('')

    t.throws(
      fail,
      Error,
      'remark-escape-escaped needs to be passed a configuration array as option'
    )
  })

  ava('Errors with invalid config: 1', t => {
    const fail = () => unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin, 1)
      .use(stringify)
      .processSync('')

    t.throws(
      fail,
      Error,
      'remark-escape-escaped needs to be passed a configuration array as option'
    )
  })
})
