import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'


const render = text => unified()
  .use(reParse)
  .use(plugin)
  .use(remark2rehype)
  .use(rehypeStringify)
  .processSync(text)

const fixture = dedent`
  Test ping
  =========

  ping @Clem

  ping @**BALDE SOULEYMANE**

  no ping @dqsjdjsqjhdshqjkhfyhefezhjzjhdsjlfjlsqjdfjhsd

  no ping @**I AM CLEM**
`

test('ping', () => {
  const { contents } = render(fixture)
  expect(contents).toMatchSnapshot()
})

test('ping to markdown', () => {
  const { contents } = unified()
    .use(reParse)
    .use(remarkStringify)
    .use(plugin)
    .processSync(fixture)

  expect(contents).toMatchSnapshot()
})
