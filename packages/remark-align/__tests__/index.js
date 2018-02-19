import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'

import remarkAlign from '../src/'

const render = (text, config) => unified()
  .use(reParse)
  .use(remarkAlign, config)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

const renderToMarkdown = (text, config) => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(remarkAlign, config)
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

  <-left aligned<-

  a simple paragraph

  ->A started block without end.
`

test('align', () => {
  const {contents} = render(alignFixture)
  expect(contents).toMatchSnapshot()
})

test('align-custom-config', () => {
  const {contents} = render(alignFixture, {
    right: 'custom-right',
    center: 'custom-center',
  })
  expect(contents).toMatchSnapshot()
})

test('align-custom-config', () => {
  const {contents} = render(alignFixture, {
    left: 'custom-left',
    right: 'custom-right',
    center: 'custom-center',
  })
  expect(contents).toMatchSnapshot()
})

test('block-wrap', () => {
  const {contents} = render(dedent`
    # wraps blocks e.g. title:

    -> foo

    # title

    foo ->
  `)
  expect(contents).toMatchSnapshot()
})

test('center-no-start', () => {
  const {contents} = render(dedent`
    # title

    foo <-

    # title
  `)
  expect(contents).toMatchSnapshot()
})

test('right-no-end', () => {
  const {contents} = render(dedent`
    # title

    -> foo

    # title
  `)
  expect(contents).toMatchSnapshot()
})

test('right-no-start', () => {
  const {contents} = render(dedent`
    # title

    foo ->

    # title
  `)
  expect(contents).toMatchSnapshot()
})

test('list-block', () => {
  const {contents} = render(dedent`
    # title
    ->
    - a
    - b
    ->
    ->
    - c
    - d
    <-
  `)
  expect(contents).toMatchSnapshot()
})

test.skip('should not break blocks such as lists', () => {
  const {contents} = render(dedent`
    # title
    ->
    - list item
    - list -> item
    - sublist
    - ->
    - c
    - d
    <-
  `)
  expect(contents).toBe(dedent`
    <h1>title</h1>
    <div class="align-center"><ul>
    <li>list item</li>
    <li>list -> item</li>
    <li>sublist</li>
    <li>-></li>
    <li>c</li>
    <li>d</li>
    </ul></div>
  `)
})

test('escapable', () => {
  const {contents} = render(dedent`
    # title
    ->
    foo
    \->escaped-in
    <-

    \->escaped-out

    ->center<-
  `)
  expect(contents).toMatchSnapshot()
})

test('left align', () => {
  const {contents} = render(dedent`
    # title

    <- foo <-

    # title
  `)
  expect(contents).toMatchSnapshot()
})

test('no content', () => {
  const md = dedent`
    <- <-

    <-

    <-

    -> <-

    -><-

    ->

    <-

    ->->

    ->  ->

    ->
    ->

    ->

    ->
  `

  const {contents} = render(md)
  expect(contents).toMatchSnapshot()

  const contents1 = renderToMarkdown(md).contents
  const contents2 = renderToMarkdown(contents1).contents

  expect(contents1).toBe(contents2)
})

test('compiles to markdown', () => {
  const md = dedent`
    # title

    <- foo <-

    # title

    -> **foo** <-

    ->
    ![img](src)
    ->

    # wraps blocks e.g. title:

    -> foo

    # title

    foo ->
  `
  const {contents} = renderToMarkdown(md)
  expect(contents).toMatchSnapshot()

  const contents1 = renderToMarkdown(md).contents
  const contents2 = renderToMarkdown(contents1).contents

  expect(contents1).toBe(contents2)
})
