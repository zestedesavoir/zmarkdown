import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'

const mockUsernames = [
  'I AM CLEM',
  'dqsjdjsq',
]

function pingUsername (username) {
  return mockUsernames.includes(username)
}
function userURL (username) {
  return `/membres/voir/${username}/`
}

const render = text => unified()
  .use(reParse)
  .use(plugin, {pingUsername, userURL})
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
  const {contents} = render(fixture)
  expect(contents).toMatchSnapshot()
})
