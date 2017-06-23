import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import remarkCaptions from '../src/'

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
  .use(remarkCaptions, config)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

test('code', () => {
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
  `, { external: { table: 'CustomTable:' } })
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
  `)
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


    head1| head2
    -----|------
    bla|bla
    Table: figcapt1
    Table: bis
  `)
  expect(contents).toMatchSnapshot()
})
