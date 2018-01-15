const a = require('axios')
const fs = require('fs')

const u = (path) => `http://localhost:27272${path}`
const html = u('/html')
const latex = u('/latex')

const rm = (dir, file) => new Promise((resolve, reject) =>
  fs.unlink(`${dir}/${file}`, (err) => {
    if (err) reject(err)
    fs.rmdir(dir, (err) => {
      if (err) reject(err)
      resolve('ok')
    })
  }))

describe('HTML endpoint', () => {
  test('It should accept POSTed markdown', async () => {
    const response = await a.post(html, { md: '# foo', opts: {} })

    expect(response.status).toBe(200)
    const [string, metadata] = response.data
    expect(string).toMatchSnapshot()
    expect(metadata.disableToc).toBe(false)
  })

  test('It should not disable TOC', async () => {
    const response = await a.post(html, { md: '# foo', opts: {} })

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(false)
  })

  test('It should disable TOC', async () => {
    const response = await a.post(html, { md: '*foo*', opts: {} })

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(true)
  })

  test('It should get ping as metadata', async () => {
    const response = await a.post(html, { md: 'waddup @Clem', opts: {} })

    const [rendered, metadata] = response.data
    expect(rendered).toContain('class="ping"')
    expect(rendered).toContain('href="/membres/voir/Clem/"')
    expect(metadata.ping).toEqual(['Clem'])
  })

  test('It should disable ping', async () => {
    const response = await a.post(html, { md: 'waddup @Clem', opts: { disable_ping: true } })

    const [rendered, metadata] = response.data
    expect(rendered).not.toContain('class="ping"')
    expect(metadata.ping).toBe(undefined)
  })

  test('It only parses inline things', async () => {
    const response = await a.post(html, {
      md: '# foo\n```js\nwindow\n```',
      opts: { inline: true }
    })

    const [rendered] = response.data
    expect(rendered).not.toContain('<h')
  })
})

describe('LaTeX endpoint', () => {
  test('It should accept POSTed markdown', async () => {
    const response = await a.post(latex, { md: '# foo', opts: {} })
    expect(response.status).toBe(200)

    const [string, metadata] = response.data
    expect(string).toMatchSnapshot()
    expect(metadata.disableToc).toBe(false)
  })

  test('It should not disable TOC', async () => {
    const response = await a.post(latex, { md: '# foo', opts: {} })

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(false)
  })

  test('It should disable TOC', async () => {
    const response = await a.post(latex, { md: '*foo*', opts: {} })

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(true)
  })

  test('It should not have pings', async () => {
    const response = await a.post(latex, { md: 'waddup @Clem', opts: {} })

    const [rendered, metadata] = response.data
    expect(rendered).toEqual('waddup @Clem\n\n')
    expect(metadata.ping).toBe(undefined)
  })

  test('It should disable ping', async () => {
    const response = await a.post(latex, { md: 'waddup @Clem', opts: { disable_ping: true } })

    const [rendered, metadata] = response.data
    expect(rendered).not.toContain('class="ping"')
    expect(metadata.ping).toBe(undefined)
  })

  test('It only parses inline things', async () => {
    const response = await a.post(latex, {
      md: '# foo\n```js\nwindow\n```',
      opts: { inline: true }
    })

    const [rendered] = response.data
    expect(rendered).not.toContain('<h')
  })

  test('It downloads images', async () => {
    const response = await a.post(latex, {
      md: `![](${u('/static/img.png')})`,
      opts: { inline: true, images_download_dir: `${__dirname}/../public/` }
    })

    const [rendered] = response.data
    const regex = /\/([a-zA-Z0-9_-]{7,14})\/([a-zA-Z0-9_-]{7,14})\.(.*)}/
    expect(rendered).toMatch(regex)
    const [, dir, file, ext] = rendered.match(regex)
    return expect(rm(`${__dirname}/../public/${dir}`, `${file}.${ext}`)).resolves.toBe('ok')
  })
})
