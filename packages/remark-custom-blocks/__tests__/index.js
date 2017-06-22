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

  Object.keys(specs).forEach(name => {
    const spec = specs[name]

    test(name, () => {
      const {contents} = unified()
        .use(reParse)
        .use(remark2rehype)
        .use(plugin, {
          secret: 'spoiler',
          s: 'spoiler',
          information: 'information ico-after',
          i: 'information ico-after',
          question: 'question ico-after',
          q: 'question ico-after',
          attention: 'warning ico-after',
          a: 'warning ico-after',
          erreur: 'error ico-after',
          e: 'error ico-after'
        })
        .use(stringify)
        .processSync(spec.fixture)

      expect(contents).toEqual(spec.expected.trim())
    })
  })

  test('Errors without config', () => {
    const fail = () => unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin)
      .use(stringify)
      .processSync('')

    expect(fail).toThrowError(Error)
  })
})
