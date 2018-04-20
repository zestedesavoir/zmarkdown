import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkCustomBlocks from '../../remark-custom-blocks'

import plugin from '../src/'


const render = text => unified()
  .use(reParse, {
    footnotes: true,
  })
  .use(remarkCustomBlocks, {
    secret: 'spoiler',
  })
  .use(plugin)
  .use(remark2rehype)
  .use(rehypeStringify)
  .processSync(text)

const fixture = dedent`
  Blabla ||ok|| kxcvj ||ok foo|| sdff

  sdf |||| df

  sfdgs | | dfg || dgsg | qs

  With two pipes: \||key|| you'll get ||key||.

  It can contain inline markdown:

  * ||hell[~~o~~](#he)?||

  It cannot contain blocks:

  * ||hello: [[secret]]?||
`


describe('parses kbd', () => {
  it('parses a big fixture', () => {
    const {contents} = render(fixture)
    expect(contents).toMatchSnapshot()
  })

  it('escapes the start marker', () => {
    const {contents} = render(dedent`
      ||one|| \||escaped|| ||three|| \|||four|| ||five||
    `)
    expect(contents).toContain('||escaped||')
    expect(contents).toContain('|<kbd>four</kbd>')
  })
})

test('to markdown', () => {
  const {contents} = unified()
    .use(reParse)
    .use(remarkStringify)
    .use(plugin)
    .processSync(fixture)

  expect(contents).toMatchSnapshot()
})
