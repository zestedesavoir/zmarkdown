import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import remarkCaptions from '../src/'
import remarkGridTables from '../../remark-grid-tables/src'

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
  .use(remarkGridTables)
  .use(remarkCaptions, config)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

/* test('code', () => {
  const { contents } = render(dedent`
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
  
  [](#)`, {external: { code: 'Code:' }})
  expect(contents).toMatchSnapshot()
})

test('custom-table', () => {
  const { contents } = render(dedent`
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
    { external: { table: 'CustomTable:' } }
  )
  expect(contents).toMatchSnapshot()
})


test('gridtables', () => {
  const { contents } = render(dedent`
    +----+----+----+
    | a  |  b | c  |
    +====+====+====+
    | 1  |2   |3   |
    +----+----+----+
    Table: bla bla`,
    { external: {gridTable: 'Table:'}}
  )
  expect(contents).toMatchSnapshot()
})

test('quotation', () => {
  const { contents } = render(dedent`
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


test('table', () => {
  const { contents } = render(dedent`
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
  const { contents } = render(dedent`
    head1| head2
    -----|------
    bla|bla
    Table: figcapt1
    Table: bis
  `)
  expect(contents).toMatchSnapshot()
})


test('internal legend: two legends', () => {
  const { contents } = render(dedent`
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
}) */

test('legend in paragraph', () => {
  const { contents } = render(dedent`
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
  `.replace(/·/g, ' '))
  expect(contents).toMatchSnapshot()
})
