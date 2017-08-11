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
  .process(text)

const fixture = dedent`
  Test ping
  =========

  ping @Clem

  ping @**BALDE SOULEYMANE**

  no ping @dqsjdjsqjhdshqjkhfyhefezhjzjhdsjlfjlsqjdfjhsd

  no ping @**I AM CLEM**
`

const html = dedent`<h1>Test ping</h1>
  <p>ping @Clem</p>
  <p>ping @<strong>BALDE SOULEYMANE</strong></p>
  <p>no ping @dqsjdjsqjhdshqjkhfyhefezhjzjhdsjlfjlsqjdfjhsd</p>
  <p>no ping <a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></p>
`

test('parses', () => {
  expect(
    render(fixture).then(vfile => vfile.contents)
  ).resolves.toBe(html)
})

test('sets ping data on vfile', () => {
  expect(
    render(fixture).then(vfile => vfile.data.ping)
  ).resolves.toEqual(['I AM CLEM'])
})
