import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import footnotesTitle from '../src/'

const render = config => unified()
  .use(reParse, {
    footnotes: true,
  })
  .use(remark2rehype)
  .use(footnotesTitle, config)
  .use(stringify)
  .processSync(dedent`
    This is the body with a footnote[^1] or two[^2] or more[^3] [^4] [^5].

    Also a reference that does not exist[^6].

    [^1]: Footnote that ends with a list:

        * item 1
        * item 2

    [^2]: > This footnote is a blockquote.

    [^3]: A simple oneliner.

    [^4]: A footnote with multiple paragraphs.

        Paragraph two.

    [^5]: First line of first paragraph.
    Second line of first paragraph is not intended.
    Nor is third...
  `)

it('renders correctly with first config', () => {
  const {contents} = render('Foo bar $id')
  expect(contents).toMatchSnapshot()
})

it('renders correctly with second config', () => {
  const {contents} = render('Baz $id qux?')
  expect(contents).toMatchSnapshot()
})

it('renders correctly without config', () => {
  const {contents} = render()
  expect(contents).toMatchSnapshot()
})
