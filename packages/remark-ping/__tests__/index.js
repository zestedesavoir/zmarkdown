import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remark2rehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

import plugin from '../src/'

const mockUsernames = [
  'I AM CLEM',
  'qux',
  'foo',
  'bar',
  'baz baz',
  'Moté',
  'Phigger Moté',
  'Digitals@m',
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
    ping @Clem

    ping @**FOO BAR**

    no ping @quxjhdshqjkhfyhefezhjzjhdsjlfjlsqjdfjhsd

    ping [@**I AM CLEM**](http://example.com)

    @**baz baz**
  `,
  dedent`
    ## Test ping @**I AM CLEM**

    > > no metadata output @**I AM CLEM**

    > no metadata output @**I AM CLEM**

    ping @**I AM CLEM**

    ping _@**I AM CLEM**_

    > no metadata output @**I AM CLEM**
  `,
  dedent`
    @foo @bar

    @baz baz

    > @**baz baz**
  `,
  dedent`
    @Moté @Phigger

    @**Phigger Moté**

    @Digitals@m @**Digitals@m**
  `,
]

const pings = [
  ['I AM CLEM', 'baz baz'],
  ['I AM CLEM', 'I AM CLEM', 'I AM CLEM'],
  ['foo', 'bar'],
  ['Moté', 'Phigger Moté', 'Digitals@m'],
]

fixtures.forEach((fixture, i) => {
  describe(`fixture suite ${i}`, () => {
    test('parses', () => {
      expect(remark(fixture)).toMatchSnapshot(`f${i}`)
    })

    test('sets ping data on vfile', () => {
      return expect(
        toHTML(fixture).then(vfile => vfile.data.ping)
      ).resolves.toEqual(pings[i])
    })

    test('compiles to HTML', () => {
      return expect(
        toHTML(fixture).then(vfile => vfile.contents)
      ).resolves.toMatchSnapshot(`h${i}`)
    })

    test('compiles to Markdown', () => {
      expect(toMarkdown(fixture)).toMatchSnapshot(`m${i}`)
    })
  })
})

test('compiles to Markdown', () => {
  const toMarkdown = text => unified()
    .use(reParse)
    .use(remarkStringify)
    .use(plugin, {
      pingUsername: 12,
      userURL,
    })
    .processSync(text)
    .toString()

  expect(() => toMarkdown(dedent`
    # foo
    @**I AM CLEM**
  `)).toThrowErrorMatchingSnapshot()
})

test('do not create ping links in links', () => {
  return expect(
    toHTML(dedent`
      [foo @**I AM CLEM** bar](http://example.com)
    `).then(vfile => vfile.contents)
  ).resolves.toBe(dedent`
    <p><a href="http://example.com">foo <span class="ping ping-in-link">\
    @<span class="ping-username">I AM CLEM</span></span> bar</a></p>`)
})
