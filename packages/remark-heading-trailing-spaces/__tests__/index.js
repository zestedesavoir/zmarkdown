import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'


const render = text => unified()
  .use(reParse)
  .use(remark2rehype)
  .use(plugin)
  .use(rehypeStringify)
  .processSync(text.replace(/·/g, ' '))

/**
 * (for convenience, · are replaced with
 * simple single spaces in the tests)
 */

const fixture = dedent`
  Header
  ------··

  ### H3···

  H1··
  =

  H2
  --··
`

test('with plugin', () => {
  const { contents } = render(fixture)
  expect(contents).toMatchSnapshot()
})

test('without', () => {
  const { contents } = unified()
    .use(reParse)
    .use(remark2rehype)
    .use(rehypeStringify)
    .processSync(fixture)

  expect(contents).toMatchSnapshot()
})

test('regression 1', () => {
  const { contents } = render(dedent`
    word
    -·item·1
    -·item·2

    a|b
    ---|---
    c|d
  `)
  expect(contents).toMatchSnapshot()
})
