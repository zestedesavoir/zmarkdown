import dedent from 'dedent'
import {unified} from 'unified'
import reParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import pingPlugin from '../lib/index'
import remarkStringify from 'remark-stringify'
import remark2rehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

function userURL (username) {
  return `/@${username}`
}

const render = text => unified()
  .use(reParse)
  .use(remarkGfm)
  .use(pingPlugin, {userURL})
  .use(remark2rehype)
  .use(rehypeStringify)
  .processSync(text)

const renderMarkdown = text => unified()
  .use(reParse)
  .use(remarkGfm)
  .use(remarkStringify)
  .use(pingPlugin, {userURL})
  .processSync(text)

test('supports pings', () => {
  const {value} = render('ping @Clem')
  expect(value).toMatchSnapshot()
})

test('reports pings', () => {
  const {data} = render('ping @Clem')
  expect(data.ping).toContain('Clem')
})

test('allows star sequences', () => {
  const {value} = render('ping @**baz baz**')
  expect(value).toMatchSnapshot()
})

test('does not ping in link', () => {
  const {value} = render('[@**I AM CLEM**](http://example.com)')
  expect(value).not.toContain('@I AM CLEM')
  expect(value).toMatchSnapshot()
})

test('reports ping in link', () => {
  const {data} = render('[@**I AM CLEM**](http://example.com)')
  expect(data.ping).toContain('I AM CLEM')
})

test.skip('does not ping emails', () => {
  const {value} = render('hello@doesnotexi.st')
  expect(value).not.toContain('@doesnotexi.st')
  expect(value).toMatchSnapshot()
})

test('does not report ping in blockquote', () => {
  const {data} = render(dedent`ping @Clem
  > no metadata output for @**I AM CLEM**
  `)
  expect(data.ping).not.toContain('I AM CLEM')
})

test('supports Unicode', () => {
  const {value} = render('ping @Moté @Digitals@m')
  expect(value).toMatchSnapshot()
})

test('to markdown', () => {
  const {value} = renderMarkdown('ping @Clem')
  expect(value).toMatchSnapshot()
})
