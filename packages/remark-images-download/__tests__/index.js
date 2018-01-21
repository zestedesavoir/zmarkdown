/* global beforeAll, afterAll */
import clone from 'clone'
import fs from 'fs'
import dedent from 'dedent'
import path from 'path'
import rimraf from 'rimraf'

import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'
import server from '../__mock__/server'

const DOWNLOAD_DESTINATION = '/tmp'
const downloadDestination = path.join(DOWNLOAD_DESTINATION, 'remark-image-download-tests')

const renderFactory = (opts = {}) =>
  (text) => unified()
    .use(reParse)
    .use(plugin, Object.assign(clone(opts), {downloadDestination}))
    .use(remark2rehype)
    .use(stringify)
    .process(text)

beforeAll((done) => {
  fs.mkdir(downloadDestination, done)
})

afterAll((done) => {
  server.close()
  rimraf(downloadDestination, done)
})

const r = (html) => html.replace(
  new RegExp(
    path.join(downloadDestination, '([a-zA-Z0-9_-]{7,14})', '([a-zA-Z0-9_-]{7,14})'),
    'g'),
  'foo/bar')

describe('mock server tests', () => {
  test('downloads image ok', () => {
    const file = dedent`
      ![](http://localhost:27273/ok.png)

      ![](http://localhost:27273/ok.png)

      ![](http://localhost:27273/ok.png)
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

  test('skips bigger images and reports', () => {
    const file = `![](http://localhost:27273/ok.png)`
    const html = `<p><img src="http://localhost:27273/ok.png"></p>`

    const error = 'File at http://localhost:27273/ok.png weighs 516, max size is 400'

    const render = renderFactory({
      maxFileSize: 400,
    })

    return render(file).then(vfile => {
      expect(vfile.messages[0].reason).toBe(error)
      expect(vfile.contents).toBe(html)
    })
  })

  test('skips wrong mimes', () => {
    const file = `![](http://localhost:27273/wrong-mime.txt)`
    const html = `<p><img src="http://localhost:27273/wrong-mime.txt"></p>`

    const render = renderFactory()

    return render(file).then(vfile => {
      expect(vfile.contents).toBe(html)
    })
  })

  test('reports bad mime headers', () => {
    const file = `![](http://localhost:27273/wrong-mime.txt)`

    const error = 'Content-Type of http://localhost:27273/wrong-mime.txt is not an image/ type'

    const render = renderFactory()

    return render(file).then(vfile => {
      expect(vfile.messages[0].reason).toBe(error)
    })
  })

  test('reports bad detected mime content', () => {
    const file = `![](http://localhost:27273/wrong-mime.png)`

    const error = 'Detected mime of http://localhost:27273/wrong-mime.png is not an image/ type'

    const render = renderFactory()

    return render(file).then(vfile => {
      expect(vfile.messages[0].reason).toBe(error)
    })
  })

  test('skips when directory reaches size limit', () => {
    const file = dedent`
      ![](http://localhost:27273/ok.png)
      ![](http://localhost:27273/ok.png)
      ![](http://localhost:27273/ok.png)
      ![](http://localhost:27273/ok.png)
    `

    // each file being roughly 30% of directory size limit, the 4th one would exceed this
    // limit. It shouldn't get downloaded & replaced:

    const html = dedent`
      <p><img src="foo/bar.png">
      <img src="foo/bar.png">
      <img src="foo/bar.png">
      <img src="http://localhost:27273/ok.png"></p>
    `

    const error = 'Cannot download http://localhost:27273/ok.png because ' +
      'destination directory reached size limit'

    const render = renderFactory({
      maxFileSize: 516,
      dirSizeLimit: (516 * 3) + 50,
    })

    return render(file)
      .then(vfile => {
        expect(vfile.messages[0].reason).toBe(error)
        expect(r(vfile.contents)).toBe(html)
      })
  })

  test('does not download when disabled', () => {
    const file = dedent`
      ![](http://localhost:27273/ok.png)
      ![](http://localhost:27273/ok.png)
      ![](http://localhost:27273/ok.png)
      ![](http://localhost:27273/ok.png)
    `

    // images will not be downloaded
    const html = dedent`
      <p><img src="http://localhost:27273/ok.png">
      <img src="http://localhost:27273/ok.png">
      <img src="http://localhost:27273/ok.png">
      <img src="http://localhost:27273/ok.png"></p>
    `

    const render = renderFactory({
      disabled: true,
    })

    expect(render(file).then(vfile => vfile.contents)).resolves.toBe(html)
  })

  test('skips local images', () => {
    const file = `![](local.png)`
    const html = `<p><img src="local.png"></p>`

    const render = renderFactory()

    expect(render(file).then(vfile => vfile.contents)).resolves.toBe(html)
  })

  test('copies local images with function', () => {
    const file = `![](/foobar/ok.png)`
    const html = `<p><img src="foo/bar.png"></p>`

    const render = renderFactory({
      localUrlToLocalPath: (localUrl) => {
        const localPath = __dirname.replace('__tests__', '__mock__')
        return `${localPath}/files${localUrl.slice(7)}`
      },
    })

    return render(file).then(vfile => {
      expect(r(vfile.contents)).toBe(html)
      expect(vfile.messages).toEqual([])
    })
  })

  test('copies local images with replacement array', () => {
    const file = `![](/foobar/ok.png)`
    const html = `<p><img src="foo/bar.png"></p>`

    const render = renderFactory({
      localUrlToLocalPath: [
        '/foobar',
        `${__dirname.replace('__tests__', '__mock__')}/files`,
      ],
    })

    return render(file).then(vfile => {
      expect(r(vfile.contents)).toBe(html)
      expect(vfile.messages).toEqual([])
    })
  })

  test('does not copy dangerous local absolute URLs', () => {
    const file = `![](/../../../etc/shadow)`
    const html = `<p><img src="/../../../etc/shadow"></p>`
    const render = renderFactory({
      localUrlToLocalPath: (localUrl) => {
        const localPath = __dirname.replace('__tests__', '__mock__')
        return `${localPath}/files${localUrl.slice(7)}`
      },
    })

    return render(file).then(vfile => {
      expect(vfile.messages[0].message).toMatch('Dangerous absolute image URL detected')
      expect(r(vfile.contents)).toBe(html)
    })
  })

  test('reports 404', () => {
    const file = `![](http://example.com/foo.png)`
    const html = `<p><img src="http://example.com/foo.png"></p>`

    const render = renderFactory()

    return render(file).then(vfile => {
      expect(vfile.messages[0].reason).toBe('Received HTTP404 for: http://example.com/foo.png')
      expect(vfile.contents).toBe(html)
    })
  })
})
