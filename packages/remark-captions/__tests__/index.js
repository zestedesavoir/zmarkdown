import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'

import remarkCaptions from '../src/'
import remarkGridTables from '../../remark-grid-tables/src'


const render = (text, config) => unified()
  .use(reParse, {
    gfm: true,
    commonmark: false,
    footnotes: true,
    /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
    &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
    blocks: [],
  })
  .use(remarkGridTables)
  .use(remarkCaptions, config)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)


const renderToMarkdown = (text, config) => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(remarkCaptions, config)
  .processSync(text)


test('code', () => {
  const {contents} = render(dedent`
    ## Code

    Normal code

    \`\`\`python
    print('bla')
    \`\`\`

    With Legend

    \`\`\`python
    print('bla')
    \`\`\`
    Code: figcapt1

    \`\`\`python
    print('bla')
    \`\`\`
    Code: figcapt1
    break


    \`\`\`python
    print('bla')
    \`\`\`
    Code: figcapt1 *em* **strong \`code\`** end
    bla

    \`\`\`python
    print('bla2')
    \`\`\`
    Code: figcapt1
    Code: bis
  `)
  expect(contents).toMatchSnapshot()
})

test('#101', () => {
  const {contents} = render(dedent`
  ## code followed by non text par

  \`\`\`
  foo
  \`\`\`

  [](#)`, {external: {code: 'Code:'}})
  expect(contents).toMatchSnapshot()
})

test('custom-table', () => {
  const {contents} = render(dedent`
    ## Table

    Normal table


    head1| head2
    -----|------
    bla|bla


    With Legend


    head1| head2
    -----|------
    bla|bla
    CustomTable: figcapt1


    head1| head2
    -----|------
    bla|bla
    CustomTable: figcapt1
    CustomTable: bis
    `,
  {external: {table: 'CustomTable:'}}
  )
  expect(contents).toMatchSnapshot()
})

test('gridtables', () => {
  const {contents} = render(dedent`
    +----+----+----+
    | a  |  b | c  |
    +====+====+====+
    | 1  |2   |3   |
    +----+----+----+
    Table: bla bla`,
  {external: {gridTable: 'Table:'}}
  )
  expect(contents).toMatchSnapshot()
})

test('caption without block', () => {
  const {contents} = render(dedent`
      \`\`\`python
      print('bla')
      \`\`\`

      \`\`\`python hl_lines=1,2
      print('bla')
      print('bla')
      print('bla')
      \`\`\`

      \`\`\`
      a code without lang
      \`\`\`
    `, {external: {gridTable: 'Table:'}}
  )
  expect(contents).toMatchSnapshot()
})

test('quotation', () => {
  const {contents} = render(dedent`
    (for convenience, · are replaced with
    simple single spaces in the tests)

    ## Blockquote

    Empty blockquote

    >


    Normal blockquote

    > My citation

    With Legend

    > My citation
    Source: figcapt1

    With Legend without Source:

    > My citation
    : figcapt2

    haha

    > > > Foo··
    > > > Foo
    > > Source: fc1
    > >
    > > Bar··
    > > Bar··
    > Source: fc2
    >
    > Baz
    > Baz
    Source: fc3
  `.replace(/·/g, ' '))
  expect(contents).toMatchSnapshot()
})

test('captions should break lists', () => {
  const {contents} = render(dedent`
    > * Bar
    Source: fc2

    > * Baz
    >     * Baz
    Source: fc3
  `.replace(/·/g, ' '))
  expect(contents).toMatchSnapshot()
})

test('table', () => {
  const {contents} = render(dedent`
    ## Table

    Normal table


    head1| head2
    -----|------
    bla|bla


    With Legend


    head1| head2
    -----|------
    bla|bla
    Table: figcapt1
  `)
  expect(contents).toMatchSnapshot()
})

test('external legend: two legends', () => {
  const {contents} = render(dedent`
    head1| head2
    -----|------
    bla|bla
    Table: figcapt1
    Table: bis
  `)
  expect(contents).toMatchSnapshot()
})

test('internal legend: two legends', () => {
  const {contents} = render(dedent`
    Should only keep the 1st

    > My citation
    Source: first capt
    Source: last capt··
    2nd line

    noop

    > foo
    > bar
    > baz
    > qux
    Source: **first**
    b*a*r
    Source: This is **the real** \`source\`

    noop
  `.replace(/·/g, ' '))
  expect(contents).toMatchSnapshot()
})

test('legend in paragraph', () => {
  const {contents} = render(dedent`
    foo

    ![]()
    Figure: 1 this is parsed as legend

    baz

    ![]()
    aFigure: 2 this is displayed as text

    ![alt 2b](https://zestedesavoir.com/static/images/home-clem.4a2f792744c9.png)
    this is displayed as text

    foo
    ![]()
    Figure: 3 this is a legend

    ![]()
    Figure: 4 this is a legend, remainder of the paragraph goes into
    the
    legend

    Figure: 5 this is a text with and image
    ![]()
    in the middle

    Figure: 6 displayed as text
    ![]()
    Figure: 7 is a legend

    ![]()
    Figure: 8 is a legend.

    Figure: 9 this is a text.
  `.replace(/·/g, ' '))
  expect(contents).toMatchSnapshot()
})

test('compiles to markdown when no caption', () => {
  const md = dedent`
    foo

    ![](img)
    Figure: 1 this is parsed as legend

    baz

    ![](img)
    aFigure: 2 this is displayed as text

    ![alt 2b](https://zestedesavoir.com/static/images/home-clem.4a2f792744c9.png)
    this is displayed as text
  `
  const {contents} = renderToMarkdown(md)
  expect(contents).toMatchSnapshot()

  const contents1 = renderToMarkdown(md).contents
  const contents2 = renderToMarkdown(contents1).contents

  expect(contents1).toBe(contents2)
})
test('compiles to markdown when at least 1 block caption', () => {
  const md = dedent`
    foo
    ![](img)
    Figure: 3 this is a legend

    ![](img)
    Figure: 4 this is a legend, remainder of the paragraph goes into
    the
    legend

    Figure: 5 this is a text with and image
    ![](<title> img)
    in the middle

    Figure: 6 displayed as text
    ![](img)
    Figure: 7 is a legend

    ![](img)
    Figure: 8 is a legend.

    Figure: 9 this is a text.

    > My citation
    Source: first capt
    Source: last capt··
    2nd line

    noop

    > foo
    > bar
    > baz
    > qux
    Source: **first**
    b*a*r
    Source: This is **the real** \`source\`

    noop

    > foo
    > bar
    > baz
    > qux
    Source: **first**
    b*a*r
    Source: This is **the real** \`source\`

  `
  const {contents} = renderToMarkdown(md)
  expect(contents).toMatchSnapshot()

  const contents1 = renderToMarkdown(md).contents
  const contents2 = renderToMarkdown(contents1).contents

  expect(contents1).toBe(contents2)
})

test('compiles to markdown when at least 1 innerLegend caption', () => {
  const md = dedent`
    ## Code

    Normal code

    \`\`\`python
    print('bla')
    \`\`\`

    With Legend

    \`\`\`python
    print('bla')
    \`\`\`
    Code: figcapt1

    \`\`\`python
    print('bla')
    \`\`\`
    Code: figcapt1
    break

    \`\`\`python
    print('bla')
    \`\`\`
    Code: figcapt1 *em* **strong \`code\`** end
    bla

    \`\`\`python
    print('bla2')
    \`\`\`
    Code: figcapt1
    Code: bis
  `
  const {contents} = renderToMarkdown(md)
  expect(contents).toMatchSnapshot()

  const contents1 = renderToMarkdown(md).contents
  const contents2 = renderToMarkdown(contents1).contents

  expect(contents1).toBe(contents2)
})
