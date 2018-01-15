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

const r = (html) => html.replace(/"([a-zA-Z0-9_-]{7,14})\/([a-zA-Z0-9_-]{7,14})/g, '"foo/bar')

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

  return render(file).then(vfile => {
    expect(r(vfile.contents)).toBe(html)
  })
})

test('does not crash without images', () => {
  const file = `foo`
  const html = `<p>foo</p>`

  const render = renderFactory()

  return render(file).then(vfile => {
    expect(vfile.contents).toBe(html)
  })
})

test('skips bigger images and reports', async () => {
  const file = `![](http://example.com/too-big.png)`
  const html = `<p><img src="http://example.com/too-big.png"></p>`

  const error = 'File at http://example.com/too-big.png weighs 99999999, max size is 1000000'

  const render = renderFactory()

  return render(file)
    .then(vfile => {
      expect(vfile.messages[0].reason).toBe(error)
      expect(vfile.contents).toBe(html)
    })
})

test('skips wrong mimes and reports', async () => {
  const file = `![](http://example.com/wrong-mime.png)`
  const html = `<p><img src="http://example.com/wrong-mime.png"></p>`

  const error = 'Content-Type of http://example.com/wrong-mime.png is not of image/ type'

  const render = renderFactory()

  return render(file)
    .then(vfile => {
      expect(vfile.messages[0].reason).toBe(error)
      expect(vfile.contents).toBe(html)
    })
})

test('does not report wrong extensions', () => {
  const file = `![](http://example.com/wrong.ext)`
  const html = '<p><img src="foo/bar.ext"></p>'

  const render = renderFactory()

  return render(file)
    .then(vfile => {
      expect(vfile.messages).toEqual([])
      expect(r(vfile.contents)).toMatch(html)
    })
})

test('skips when directory reaches size limit', async () => {
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

  const error = 'Cannot download http://example.com/30percent.png because ' +
    'destination directory reached size limit'

  const render = renderFactory({
    maxFileSize: 3500,
    dirSizeLimit: (3500 * 3) - 1000
  })

  return render(file)
    .then(vfile => {
      expect(vfile.messages[0].reason).toBe(error)
      expect(r(vfile.contents)).toBe(html)
    })
})

test('does not download when disabled', () => {
  const file = dedent`
    ![](http://example.com/ok.png)
    ![](http://example.com/ok.png)
    ![](http://example.com/ok.png)
    ![](http://example.com/ok.png)
  `

  // images will not be downloaded
  const html = dedent`
    <p><img src="http://example.com/ok.png">
    <img src="http://example.com/ok.png">
    <img src="http://example.com/ok.png">
    <img src="http://example.com/ok.png"></p>
  `

  const render = renderFactory({
    disabled: true
  })

  expect(render(file).then(vfile => vfile.contents)).resolves.toBe(html)
})

test('skips local images', () => {
  const file = `![](local.png)`
  const html = `<p><img src="local.png"></p>`

  const render = renderFactory()

  expect(render(file).then(vfile => vfile.contents)).resolves.toBe(html)
})
