import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import remarkAlign from '../src/'

const render = (text, config) => unified()
  .use(reParse)
  .use(remarkAlign, config)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

const alignFixture = dedent`
  Test align
  ==========

  A simple paragraph

  ->A centered paragraph<-

  a simple paragraph

  ->A right aligned paragraph->

  an other simple paragraph

  A simple paragraph

  ->A centered paragraph<-

  a simple paragraph

  ->A right aligned paragraph->

  an other simple paragraph

  ->A centered paragraph.

  Containing two paragraph<-

  an other simple paragraph

  ->A right aligned paragraph.

  Containing two paragraph<-

  an other simple paragraph

  ->A centered paragraph.<-
  ->An other centered paragraph.<-

  a simple paragraph

  ->A started block without end.
`

test('align', () => {
  const { contents } = render(alignFixture)
  expect(contents).toMatchSnapshot()
})

test('align-custom-config', () => {
  const { contents } = render(alignFixture, {
    right: 'custom-right',
    center: 'custom-center'
  })
  expect(contents).toMatchSnapshot()
})

test('block-wrap', () => {
  const { contents } = render(dedent`
    # wraps blocks e.g. title:

    -> foo

    # title

    foo ->
  `)
  expect(contents).toMatchSnapshot()
})

test('center-no-start', () => {
  const { contents } = render(dedent`
    # title

    foo <-

    # title
  `)
  expect(contents).toMatchSnapshot()
})

test('right-no-end', () => {
  const { contents } = render(dedent`
    # title

    -> foo

    # title
  `)
  expect(contents).toMatchSnapshot()
})

test('right-no-start', () => {
  const { contents } = render(dedent`
    # title

    foo ->

    # title
  `)
  expect(contents).toMatchSnapshot()
})
