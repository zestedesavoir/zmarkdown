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

  ava('align', t => {
    const spec = specs['align']
    const {contents} = unified()
      .use(reParse)
      .use(plugin)
      .use(remark2rehype)
      .use(stringify)
      .processSync(spec.fixture)

    t.deepEqual(contents, spec.expected.trim())
  })

  ava('align-custom-config', t => {
    const spec = specs['align-custom-config']
    const {contents} = unified()
      .use(reParse)
      .use(plugin, {
        right: 'custom-right',
        center: 'custom-center'
      })
      .use(remark2rehype)
      .use(stringify)
      .processSync(spec.fixture)

    t.deepEqual(contents, spec.expected.trim())
  })

  ava('block-wrap', t => {
    const spec = specs['block-wrap']
    const {contents} = unified()
      .use(reParse)
      .use(plugin)
      .use(remark2rehype)
      .use(stringify)
      .processSync(spec.fixture)

    t.deepEqual(contents, spec.expected.trim())
  })

  ava('center-no-start', t => {
    const spec = specs['center-no-start']
    const {contents} = unified()
      .use(reParse)
      .use(plugin)
      .use(remark2rehype)
      .use(stringify)
      .processSync(spec.fixture)

    t.deepEqual(contents, spec.expected.trim())
  })

  ava('right-no-end', t => {
    const spec = specs['right-no-end']
    const {contents} = unified()
      .use(reParse)
      .use(plugin)
      .use(remark2rehype)
      .use(stringify)
      .processSync(spec.fixture)

    t.deepEqual(contents, spec.expected.trim())
  })

  ava('right-no-start', t => {
    const spec = specs['right-no-start']
    const {contents} = unified()
      .use(reParse)
      .use(plugin)
      .use(remark2rehype)
      .use(stringify)
      .processSync(spec.fixture)

    t.deepEqual(contents, spec.expected.trim())
  })
})
