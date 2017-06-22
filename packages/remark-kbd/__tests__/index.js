import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkCustomBlocks from '../../remark-custom-blocks'

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

  test('kbd', () => {
    const {contents} = unified()
      .use(reParse, {
        footnotes: true
      })
      .use(remark2rehype)
      .use(remarkCustomBlocks, {
        secret: 'spoiler'
      })
      .use(plugin)
      .use(rehypeStringify)
      .processSync(specs['kbd'].fixture)

    expect(contents).toEqual(specs['kbd'].expected.trim())
  })

  test('to markdown', () => {
    const {contents} = unified()
      .use(reParse)
      .use(remarkStringify)
      .use(plugin)
      .processSync(specs['kbd'].fixture)

    expect(contents).toEqual(specs['md'].fixture)
  })
})
