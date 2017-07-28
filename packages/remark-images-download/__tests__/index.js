import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

jest.mock('fs') // eslint-disable-line no-undef
jest.mock('request-promise') // eslint-disable-line no-undef

import plugin from '../src/'

const renderFactory = (opts) =>
  (text) => unified()
    .use(reParse)
    .use(plugin, opts)
    .use(remark2rehype)
    .use(stringify)
    .process(text)

const replace = (html) => html.replace(/"([a-zA-Z0-9-_]{9,10})\/([a-zA-Z0-9-_]{9,10})/g, '"foo/bar')

test('downloads image ok', () => {
  const file = dedent`
    ![](http://example.com/ok.png)

    ![](http://example.com/ok.png)

    ![](http://example.com/ok.png)
  `
  const html = dedent`
    <p><img src="foo/bar.png"></p>
    <p><img src="foo/bar.png"></p>
    <p><img src="foo/bar.png"></p>
  `

  const render = renderFactory()
  expect(render(file).then(vfile => replace(vfile.contents))).resolves.toBe(html)
})

test('does not crash without images', () => {
  const file = `foo`
  const html = `<p>foo</p>`

  const render = renderFactory()
  expect(render(file).then(vfile => vfile.contents)).resolves.toBe(html)
})

test('skips bigger images', (done) => {
  const file = `![](http://example.com/too-big.png)`
  const html = `<p><img src="http://example.com/too-big.png"></p>`

  const render = renderFactory({
    report: (err) => {
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toMatchSnapshot()
      done()
    },
  })

  expect(render(file).then(vfile => vfile.contents)).resolves.toBe(html)
})

test('skips wrong mimes', (done) => {
  const file = `![](http://example.com/wrong-mime.png)`
  const html = `<p><img src="http://example.com/wrong-mime.png"></p>`

  const render = renderFactory({
    report: (err) => {
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toMatchSnapshot()
      done()
    },
  })

  expect(render(file).then(vfile => vfile.contents)).resolves.toBe(html)
})

test('does not report wrong extensions', () => {
  const file = `![](http://example.com/wrong.ext)`
  const html = `<p><img src="foo/bar.ext"></p>`

  const render = renderFactory()
  expect(render(file).then(vfile => replace(vfile.contents))).resolves.toBe(html)
})

test('skips when directory reaches size limit', (done) => {
  const file = dedent`
    ![](http://example.com/30percent.png)
    ![](http://example.com/30percent.png)
    ![](http://example.com/30percent.png)
    ![](http://example.com/30percent.png)
  `

  // each file being 30% of directory size limit, the 4th one would exceed this
  // limit. It shouldn't get downloaded & replaced:

  const html = dedent`
    <p><img src="foo/bar.png">
    <img src="foo/bar.png">
    <img src="foo/bar.png">
    <img src="http://example.com/30percent.png"></p>
  `

  const render = renderFactory({
    report: (err) => {
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toMatchSnapshot()
      done()
    },
    maxFileSize: 3500,
    dirSizeLimit: 10000
  })

  expect(render(file).then(vfile => replace(vfile.contents))).resolves.toBe(html)
})
