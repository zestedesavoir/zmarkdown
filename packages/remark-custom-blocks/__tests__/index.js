import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'

const render = (text, allowTitle) => unified()
  .use(reParse)
  .use(remark2rehype)
  .use(plugin, {
    secret: {
      classes: 'spoiler',
    },
    s: {
      classes: 'spoiler',
    },
    information: {
      classes: 'information ico-after',
    },
    i: {
      classes: 'information ico-after',
    },
    question: {
      classes: 'question ico-after',
    },
    q: {
      classes: 'question ico-after',
    },
    attention: {
      classes: 'warning ico-after',
    },
    a: {
      classes: 'warning ico-after',
    },
    erreur: {
      classes: 'error ico-after',
    },
    e: {
      classes: 'error ico-after',
    },
    neutre: {
      classes: 'neutral foo',
      title: 'required',
    },
    customizableBlock: {
      classes: 'neutral foo',
      title: 'optional',
    },
  }, allowTitle)
  .use(stringify)
  .processSync(text)

const fixture = dedent`
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
  | another

  [[q]]
  | Question Block

  [[question]]
  | another

  [[a]]
  | Attention Block

  [[attention]]
  | another

  [[e]]
  | Erreur Block

  [[erreur]]
  | another

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

  [[attention | title]]
  | not parsed
`

test('Common', () => {
  const {contents} = render(fixture)
  expect(contents).toMatchSnapshot()
})

test('title is required', () => {
  const {contents} = render(dedent`
    [[neutre]]
    | no

    [[neutre|my title]]
    | yes

    [[neutre |  my **title**]]
    | yes
  `)
  expect(contents).toMatchSnapshot()
})

test('title is optional', () => {
  const {contents} = render(dedent`
    [[customizableBlock]]
    | yes

    [[customizableBlock    | my <i>tïtle</i>]]
    | yes
  `)
  expect(contents).toMatchSnapshot()
})

test('regression 1', () => {
  const {contents} = render(dedent`
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
