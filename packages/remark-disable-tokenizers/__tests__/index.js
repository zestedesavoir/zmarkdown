import dedent from 'dedent'
import {unified} from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../lib/index'

test('block', () => {
  const {value} = unified()
    .use(reParse)
    .use(plugin, [
      'blockQuote'
    ])
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(value).toMatchSnapshot()
})

test('inline', () => {
  const {value} = unified()
    .use(reParse)
    .use(plugin, [
      'attention'
    ])
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(value).toMatchSnapshot()
})

test('block + inline', () => {
  const {value} = unified()
    .use(reParse)
    .use(plugin, [
      'blockQuote',
      'attention'
    ])
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(value).toMatchSnapshot()
})

test('does nothing', () => {
  const {value} = unified()
    .use(reParse)
    .use(plugin)
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(value).toMatchSnapshot()
})

test('unknown tokenizer', () => {
  const {value} = unified()
    .use(reParse)
    .use(plugin, [
      'foo bar'
    ])
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(value).toMatchSnapshot()
})
