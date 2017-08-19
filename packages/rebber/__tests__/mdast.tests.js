/* eslint-disable no-console */
import {readdirSync as directory, readFileSync as file, lstatSync as stat} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
// import remarkMath from 'remark-math'
import rebber from '../src'
// import dedent from 'dedent'

const base = join(__dirname, 'fixtures/remark/')
const fixtures = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  if (!tests[parts[0]]) {
    tests[parts[0]] = {}
  }
  if (stat(join(base, contents)).isFile()) {
    tests[parts[0]] = file(join(base, contents), 'utf-8')
  }
  return tests
}, {})

describe('remark fixtures', () => {
  Object.keys(fixtures).filter(Boolean).forEach(name => {
    const fixture = fixtures[name]

    test(name, () => {
      const {contents} = unified()
        .use(reParse, {footnotes: true})
        .use(rebber)
        .processSync(fixture)

      expect(contents.trim()).toMatchSnapshot()
    })
  })
})
