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
    footnotes: true
  })
  .use(remark2rehype)
  .use(remarkCustomBlocks, {
    secret: 'spoiler'
  })
  .use(plugin)
  .use(rehypeStringify)
  .processSync(text)

const fixture = dedent`
  Blabla ||ok|| kxcvj ||ok foo|| sdff

  sdf |||| df

  sfdgs | | dfg || dgsg | qs

  With two pipes: \||key|| you'll get ||key||.

  It parses inline elements inside:

  * ||hell[~~o~~](#he)?||

  but not block elements inside:

  * ||hello: [[secret]]?||
`


test('kbd', () => {
  const { contents } = render(fixture)
  expect(contents).toMatchSnapshot()
})

test('to markdown', () => {
  const { contents } = unified()
    .use(reParse)
    .use(remarkStringify)
    .use(plugin)
    .processSync(fixture)

  expect(contents).toMatchSnapshot()
})
