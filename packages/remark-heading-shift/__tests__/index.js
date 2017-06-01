import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import ava from 'ava'
import remark from 'remark'

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
    const shift = name.length > 8 ? Number(name.slice(8)) : undefined

    ava(name, t => {
      const {contents} = remark().use(plugin, shift).processSync(spec.fixture)
      t.deepEqual(contents, spec.expected)
    })
  })
})
