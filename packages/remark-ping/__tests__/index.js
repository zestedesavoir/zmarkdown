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

    no ping @**I AM CLEM**

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
]

const outputs = [
  dedent`
    <p>ping @Clem</p>
    <p>ping @<strong>FOO BAR</strong></p>
    <p>no ping @quxjhdshqjkhfyhefezhjzjhdsjlfjlsqjdfjhsd</p>
    <p>no ping <a href="/membres/voir/I AM CLEM/" class="ping" rel="nofollow">I AM CLEM</a></p>
    <p><a href="/membres/voir/baz baz/" class="ping" rel="nofollow">baz baz</a></p>
  `,
  dedent`
    <h2>\
    Test ping \
    <a href="/membres/voir/I AM CLEM/" class="ping" rel="nofollow">I AM CLEM</a>\
    </h2>
    <blockquote>
    <blockquote>
    <p>\
    no metadata output \
    <a href="/membres/voir/I AM CLEM/" class="ping" rel="nofollow">\
    I AM CLEM\
    </a>\
    </p>
    </blockquote>
    <p>\
    no metadata output \
    <a href="/membres/voir/I AM CLEM/" class="ping" rel="nofollow">I AM CLEM</a>\
    </p>
    </blockquote>
    <p>\
    ping \
    <a href="/membres/voir/I AM CLEM/" class="ping" rel="nofollow">I AM CLEM</a>\
    </p>
    <p>\
    ping \
    <em><a href="/membres/voir/I AM CLEM/" class="ping" rel="nofollow">I AM CLEM</a></em>\
    </p>
    <blockquote>
    <p>\
    no metadata output \
    <a href="/membres/voir/I AM CLEM/" class="ping" rel="nofollow">I AM CLEM</a>\
    </p>
    </blockquote>
  `,
  '<p><a href="/membres/voir/foo/" class="ping" rel="nofollow">foo</a> ' +
  '<a href="/membres/voir/bar/" class="ping" rel="nofollow">bar</a></p>\n' +
  '<p>@baz baz</p>\n' +
  '<blockquote>\n' +
  '<p><a href="/membres/voir/baz baz/" class="ping" rel="nofollow">baz baz</a></p>\n' +
  '</blockquote>',
]

const pings = [
  ['I AM CLEM', 'baz baz'],
  ['I AM CLEM', 'I AM CLEM', 'I AM CLEM'],
  ['foo', 'bar'],
]


fixtures.forEach((fixture, i) => {
  describe(`fixture suite ${i}`, () => {
    test('parses', () => {
      expect(remark(fixture)).toMatchSnapshot(`f${i}`)
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
