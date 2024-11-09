import dedent from 'dedent'
import { unified } from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'

import remarkAbbr from '../lib/index'

const render = (text, config) => {
  const result = unified()
    .use(reParse)
    .use(remarkAbbr, config)
    .use(remark2rehype, {
      handlers: {
        abbrDefinition: () => undefined,
      }
    })
    .use(stringify)
    .processSync(text)
  return String(result)
}

const renderToMarkdown = (text, config) => {
  const result = unified()
    .use(reParse)
    .use(remarkAbbr, config)
    .use(remarkStringify)
    .processSync(text)

  return String(result)
}

const configToTest = {
  'no-config': undefined,
  'empty object': {},
  // TODO - add support for expandFirst
  // expandFirst: {expandFirst: true},
}

for (const [configName, config] of Object.entries(configToTest)) {
  it(`${configName} renders references`, () => {
    const contents = render(dedent`
      This is an abbreviation: REF.
      ref and REFERENCE should be ignored.

      Here is another one in a link: [FOO](http://example.com).

      Here is the first one in a link: [REF](http://example.com).

      *[REF]: Reference
      *[FOO]: Reference
    `, config)

    expect(contents).toMatchSnapshot()
  })


  it(`${configName} passes the first regression test`, () => {
    const contents = render(dedent`
      The HTML specification is maintained by the W3C:\
      [link](https://w3c.github.io/html/), this line had an abbr before link.

      A line with [a link](http://example.com) before an abbr: HTML.

      *[HTML]: Hyper Text Markup Language
      *[W3C]:  World Wide Web Consortium
    `, config)

    expect(contents).toMatchSnapshot()
  })

  it(`${configName} passes the second regression test`, () => {
    const contents = render(dedent`
      The HTML specification is maintained by the W3C:\
      [link](https://w3c.github.io/html/), this line had an abbr before **link** HTML.

      A line with [a link](http://example.com) before an abbr: HTML.

      *[HTML]: Hyper Text Markup Language
      *[W3C]:  World Wide Web Consortium
    `, config)

    expect(contents).toMatchSnapshot()
  })

  it(`${configName} passes the retro test`, () => {
    const input = dedent`
      An ABBR: "REF", ref and REFERENCE should be ignored.

      The HTML specification is maintained by the W3C.

      *[REF]: Reference
      *[ABBR]: This gets overridden by the next one.
      *[ABBR]: Abbreviation
      *[HTML]: Hyper Text Markup Language
      *[W3C]:  World Wide Web Consortium
    `

    const html = render(input)
    expect(html).toMatchSnapshot()

    const markdown = renderToMarkdown(input)
    expect(markdown).toMatchSnapshot()
  })

  it(`${configName} no reference`, () => {
    const contents = render(dedent`
      No reference!
    `, config)

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
    const contents = renderToMarkdown(md)
    expect(contents).toMatchSnapshot()

    const contents1 = renderToMarkdown(md)
    const contents2 = renderToMarkdown(contents1)

    expect(contents1).toBe(contents2)
  })

  it(`${configName} handles abbreviations ending with a period`, () => {
    const contents = render(dedent`
      A.B.C. and C-D%F. foo

      *[A.B.C.]: ref1
      *[C-D%F.]: ref2
    `, config)

    expect(contents).toContain(`<abbr title="ref1">A.B.C.</abbr>`)
    expect(contents).toContain(`<abbr title="ref2">C-D%F.</abbr>`)
  })

  it(`${configName} does not parse words starting with abbr`, () => {
    const contents = render(dedent`
      ABC ABC ABC

      *[AB]: ref1
    `, config)

    expect(contents).not.toContain('<abbr')
  })

  it(`${configName} does not parse words ending with abbr`, () => {
    const contents = render(dedent`
      ABC ABC ABC

      *[BC]: ref1
    `, config)

    expect(contents).not.toContain('<abbr')
  })

  it(`${configName} does not parse words containing abbr`, () => {
    const contents = render(dedent`
      ABC ABC ABC

      *[B]: ref1
    `, config)

    expect(contents).not.toContain('<abbr')
  })

  it(`${configName} does not break with references in their own paragraphs`, () => {
    const contents = render(dedent`
      Here is a test featuring abc and def

      *[abc]: A B C

      *[def]: D E F
    `, config)

    expect(contents).toMatchSnapshot()
  })
}
