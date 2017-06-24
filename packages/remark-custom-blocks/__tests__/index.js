import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'

const render = text => unified()
  .use(reParse)
  .use(remark2rehype)
  .use(plugin, {
    secret: 'spoiler',
    s: 'spoiler',
    information: 'information ico-after',
    i: 'information ico-after',
    question: 'question ico-after',
    q: 'question ico-after',
    attention: 'warning ico-after',
    a: 'warning ico-after',
    erreur: 'error ico-after',
    e: 'error ico-after'
  })
  .use(stringify)
  .processSync(text)

test('blocks', () => {
  const { contents } = render(dedent`
    [[s]]
    | Secret Block

    [[s]]
    |Secret Block

    [[secret]]
    | another

    > [[s]]
    > | > Blockquote in secret block in blockquote

    [[i]]
    | Information Block

    [[information]]
    | an other

    [[q]]
    | Question Block

    [[question]]
    | an other

    [[a]]
    | Attention Block

    [[attention]]
    | an other

    [[e]]
    | Erreur Block

    [[erreur]]
    | an other


    [[se]]
    | not a block

    [[secretsecret]]
    | not a block

    [[SECRET]]
    | not a block

    [[s]]
    | Multiline block
    |
    | > with blockquote !

    | Not a block
  `)
  expect(contents).toMatchSnapshot()
})

test('regression 1', () => {
  const { contents } = render(dedent`
    content before
    [[s]]
    |Block
    with content after
  `)
  expect(contents).toMatchSnapshot()
})

test('Errors without config', () => {
  const fail = () => unified()
    .use(reParse)
    .use(remark2rehype)
    .use(plugin)
    .use(stringify)
    .processSync('')

  expect(fail).toThrowError(Error)
})
