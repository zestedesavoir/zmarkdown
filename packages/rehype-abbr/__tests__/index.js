import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import abbr from '../src/'

const render = text => unified()
  .use(reParse)
  .use(remark2rehype)
  .use(abbr)
  .use(stringify)
  .processSync(text)

it('renders references', () => {
  const { contents } = render(dedent`
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
  const { contents } = render(dedent`
    The HTML specification is maintained by the W3C:\
    [link](https://w3c.github.io/html/), this line had an abbr before link.

    A line with [a link](http://example.com) before an abbr: HTML.

    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
  `)

  expect(contents).toMatchSnapshot()
})

it('passes the second regression test', () => {
  const { contents } = render(dedent`
    The HTML specification is maintained by the W3C:\
    [link](https://w3c.github.io/html/), this line had an abbr before **link** HTML.

    A line with [a link](http://example.com) before an abbr: HTML.

    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
  `)

  expect(contents).toMatchSnapshot()
})

it('passes the retro test', () => {
  const { contents } = render(dedent`
    An ABBR: "REF", ref and REFERENCE should be ignored.

    The HTML specification is maintained by the W3C.

    *[REF]: Reference
    *[ABBR]: This gets overridden by the next one.
    *[ABBR]: Abbreviation
    *[HTML]: Hyper Text Markup Language
    *[W3C]:  World Wide Web Consortium
  `)

  expect(contents).toMatchSnapshot()
})
