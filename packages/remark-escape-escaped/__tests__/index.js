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

  test('with', () => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin)
      .use(stringify)
      .processSync(specs['with'].fixture)

    expect(contents).toEqual(specs['with'].expected.trim())
  })

  test('without', () => {
    const {contents} = unified()
      .use(reParse)
      .use(remark2rehype)
      .use(stringify)
      .processSync(specs['without'].fixture)

    expect(contents).toEqual(specs['without'].expected.trim())
  })

  test('Errors with invalid config: []', () => {
    const fail = () => unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin, [])
      .use(stringify)
      .processSync('')

    expect(fail).toThrowError(Error)
  })

  test('Errors with invalid config: 1', () => {
    const fail = () => unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin, 1)
      .use(stringify)
      .processSync('')

    expect(fail).toThrowError(Error)
  })
})
