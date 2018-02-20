import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'

import remarkAbbr from '../src/'

const render = text => unified()
  .use(reParse)
  .use(remarkAbbr)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

const renderToMarkdown = (text, config) => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(remarkAbbr, config)
  .processSync(text)


it('renders references', () => {
  const {contents} = render(dedent`
    This is an abbreviation: REF.
    ref and REFERENCE should be ignored.

    Here is another one in a link: [FOO](http://example.com).

    Here is the first one in a link: [REF](http://example.com).

    *[REF]: Reference
    *[FOO]: Reference
  `)

  expect(contents).toMatchSnapshot()
})


it('passes the first regression test', () => {
  const {contents} = render(dedent`
    The HTML specification is maintained by the W3C:\
    [link](https://w3c.github.io/html/), this line had an abbr before link.

    A line with [a link](http://example.com) before an abbr: HTML.

    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
  `)

  expect(contents).toMatchSnapshot()
})

it('passes the second regression test', () => {
  const {contents} = render(dedent`
    The HTML specification is maintained by the W3C:\
    [link](https://w3c.github.io/html/), this line had an abbr before **link** HTML.

    A line with [a link](http://example.com) before an abbr: HTML.

    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
  `)

  expect(contents).toMatchSnapshot()
})

it('passes the retro test', () => {
  const input = dedent`
    An ABBR: "REF", ref and REFERENCE should be ignored.

    The HTML specification is maintained by the W3C.

    *[REF]: Reference
    *[ABBR]: This gets overridden by the next one.
    *[ABBR]: Abbreviation
    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
  `

  const {contents: html} = render(input)
  expect(html).toMatchSnapshot()

  const {contents: markdown} = renderToMarkdown(input)
  expect(markdown).toMatchSnapshot()
})

it('no reference', () => {
  const {contents} = render(dedent`
    No reference!
  `)

  expect(contents).toMatchSnapshot()
})

test('compiles to markdown', () => {
  const md = dedent`
    *abbr* HTML

    > HTML inside quote

    *[abbr]: abbreviation
    *[noabbr]: explanation that does not match
    *[HTML]: HyperText Markup Language
  `
  const {contents} = renderToMarkdown(md)
  expect(contents).toMatchSnapshot()

  const contents1 = renderToMarkdown(md).contents
  const contents2 = renderToMarkdown(contents1).contents

  expect(contents1).toBe(contents2)
})
