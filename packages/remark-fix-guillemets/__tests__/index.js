import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import remarkFixGuillemets from '../src/'
import textrGuillemets from 'typographic-guillemets'
import remarkTextr from '../remark-textr'


const render = (text, config) => unified()
  .use(reParse, {
    gfm: true,
    commonmark: false,
    yaml: false,
    footnotes: true,
    /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
    &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
    blocks: [],
  })
  .use(remarkFixGuillemets)
  .use(remark2rehype)
  .use(stringify)
  .use(remarkTextr, {
    plugins: [
      textrGuillemets,
    ],
    options: {
      locale: 'fr',
    },
  })
  .processSync(text)

test('issue-80', () => {
  const { contents } = render(dedent`
    <<html>> <<html1>> <<html2>> <<html3>> <<html4>> <<**bold**>>
  `)
  expect(contents).toMatchSnapshot()
})

test('no-html-block', () => {
  const { contents } = render(dedent`
    << 1 >>
  `)
  expect(contents).toMatchSnapshot()
})

test('do-not-replace', () => {
  const { contents } = render(dedent`
    <a>>
  `)
  expect(contents).toMatchSnapshot()
})
