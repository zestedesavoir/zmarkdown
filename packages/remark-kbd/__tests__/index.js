import dedent from 'dedent'
import {unified} from 'unified'
import reParse from 'remark-parse'
import kbdPlugin from '../lib/index'
import remarkStringify from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
// TODO (next): reintroduce once the plugin is ready
//import remarkCustomBlocks from '../../remark-custom-blocks'

const render = text => unified()
  .use(reParse)
  /*.use(remarkCustomBlocks, {
    secret: 'spoiler',
  })*/
  .use(kbdPlugin)
  .use(remark2rehype)
  .use(rehypeStringify)
  .processSync(text)

const fixture = dedent`
  Blabla ||ok|| kxcvj ||ok foo|| sdff

  sdf |||| df

  sfdgs | | dfg || dgsg | qs

  With two pipes: \||key|| you'll get ||key||.

  It cannot contain inline markdown:

  * ||hell[~~o~~](#he)?||

  It cannot contain blocks:

  * ||hello: [[secret]]?||
`

describe('parses kbd', () => {
  it('parses a big fixture', () => {
    const {value} = render(fixture)
    expect(value).toMatchSnapshot()
  })

  it('escapes the start marker', () => {
    const {value} = render(dedent`
      ||one|| \||escaped|| ||three|| \|||four|| ||five||
    `)
    expect(value).toContain('||escaped||')
    expect(value).toContain('|<kbd>four</kbd>')
  })
})

test('allow non-pipe characters', () => {
  const {value} = unified()
    .use(reParse)
    .use(kbdPlugin, {char: '+'})
    .use(remark2rehype)
    .use(rehypeStringify)
    .processSync('++CTRL++, \\+++D++')

  expect(value).toMatchSnapshot()
})

test('to markdown', () => {
  const {value} = unified()
    .use(reParse)
    .use(remarkStringify)
    .use(kbdPlugin)
    .processSync(fixture)

  expect(value).toMatchSnapshot()
})
