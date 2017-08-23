import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remark2rehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

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


const remark = text => unified()
  .use(reParse)
  .use(plugin, {pingUsername, userURL})
  .parse(text)

const toHTML = text => unified()
  .use(reParse)
  .use(plugin, {pingUsername, userURL})
  .use(remark2rehype)
  .use(rehypeStringify)
  .process(text)

const toMarkdown = text => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(plugin, {pingUsername, userURL})
  .processSync(text)
  .toString()

const fixtures = [
  dedent`
    Test ping
    =========

    ping @Clem

    ping @**FOO BAR**

    no ping @dqsjdjsqjhdshqjkhfyhefezhjzjhdsjlfjlsqjdfjhsd

    no ping @**I AM CLEM**
  `,
  dedent`
    ## Test ping @**I AM CLEM**

    > > no metadata output @**I AM CLEM**

    > no metadata output @**I AM CLEM**

    ping @**I AM CLEM**

    ping _@**I AM CLEM**_

    > no metadata output @**I AM CLEM**
  `,
]

const outputs = [
  dedent`
    <h1>Test ping</h1>
    <p>ping @Clem</p>
    <p>ping @<strong>FOO BAR</strong></p>
    <p>no ping @dqsjdjsqjhdshqjkhfyhefezhjzjhdsjlfjlsqjdfjhsd</p>
    <p>no ping <a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></p>
  `,
  dedent`
    <h2>Test ping <a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></h2>
    <blockquote>
    <blockquote>
    <p>no metadata output <a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></p>
    </blockquote>
    <p>no metadata output <a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></p>
    </blockquote>
    <p>ping <a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></p>
    <p>ping <em><a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></em></p>
    <blockquote>
    <p>no metadata output <a href="/membres/voir/I AM CLEM/" class="ping">I AM CLEM</a></p>
    </blockquote>
  `,
]

const pings = [
  ['I AM CLEM'],
  ['I AM CLEM', 'I AM CLEM', 'I AM CLEM'],
]


fixtures.forEach((fixture, i) => {
  describe(`fixture suite ${i}`, () => {
    test('parses', () => {
      expect(remark(fixture)).toMatchSnapshot()
    })

    test('sets ping data on vfile', () => {
      expect(
        toHTML(fixture).then(vfile => vfile.data.ping)
      ).resolves.toEqual(pings[i])
    })

    test('compiles to HTML', () => {
      expect(
        toHTML(fixture).then(vfile => vfile.contents)
      ).resolves.toBe(outputs[i])
    })


    test('compiles to Markdown', () => {
      expect(toMarkdown(fixture)).toMatchSnapshot()
    })
  })
})
