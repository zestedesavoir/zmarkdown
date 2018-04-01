const clone = require('clone')
const dedent = require('dedent')
const a = require('axios')
const fs = require('fs')

const u = (path) => `http://localhost:27272${path}`
const epub = u('/epub')
const html = u('/html')
const latex = u('/latex')
const texfile = u('/latex-document')
const texfileOpts = {
  content_type: 'contentType',
  title: 'The Title',
  authors: ['FØØ', 'Bär'],
  license: 'CC-BY-NC-SA',
  license_logo: 'by-nc-sa.svg',
  license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
  license_directory: '/tmp/l',
  smileys_directory: '/tmp/s',
}

const rm = (dir, file) => new Promise((resolve, reject) =>
  fs.unlink(`${dir}/${file}`, (err) => {
    if (err) reject(err)
    fs.rmdir(dir, (err) => {
      if (err) reject(err)
      resolve('ok')
    })
  }))

describe('HTML endpoint', () => {
  it('accepts POSTed markdown', async () => {
    const response = await a.post(html, {md: '# foo', opts: {}})

    expect(response.status).toBe(200)
    const [string, metadata] = response.data
    expect(string).toMatchSnapshot()
    expect(metadata.disableToc).toBe(false)
  })

  it('does not disable TOC', async () => {
    const response = await a.post(html, {md: '# foo', opts: {}})

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(false)
  })

  it('disables TOC', async () => {
    const response = await a.post(html, {md: '*foo*', opts: {}})

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(true)
  })

  it('gets ping as metadata', async () => {
    const response = await a.post(html, {md: 'waddup @Clem', opts: {}})

    const [rendered, metadata] = response.data
    expect(rendered).toContain('class="ping ping-link"')
    expect(rendered).toContain('href="/membres/voir/Clem/"')
    expect(metadata.ping).toEqual(['Clem'])
  })

  it('disables ping', async () => {
    const response = await a.post(html, {md: 'waddup @Clem', opts: {disable_ping: true}})

    const [rendered, metadata] = response.data
    expect(rendered).not.toContain('class="ping"')
    expect(metadata.ping).toBe(undefined)
    expect(metadata.languages).toEqual([])
  })

  it('only parses inline things', async () => {
    const response = await a.post(html, {
      md: '# foo\n```js\nwindow\n```',
      opts: {inline: true},
    })

    const [rendered, {languages}] = response.data
    expect(rendered).not.toContain('<h')
    expect(languages).toEqual([])
  })

  it('extracts languages', async () => {
    const response = await a.post(html, {
      md: dedent`
        \`\`\`js
        \`\`\`
        \`\`\`python
        \`\`\`
        \`\`\`java
        \`\`\`
      `,
      opts: {},
    })

    const [, {languages}] = response.data
    expect(languages).toEqual(['js', 'python', 'java'])
  })

  it('does not crash with an invalid align that looks like a comment', async () => {
    const response = await a.post(html, {
      md: '<-- x -->',
      opts: {},
    })

    const rendered = response.data[0]
    expect(rendered).toBe('<p>&#x3C;— x —></p>')
  })

  it('works with camelCase attributes', async () => {
    const response = await a.post(html, {
      md: '$$\\hat \\theta_{MC} = \\frac{\\sum_{i = 1}^n P(Y_i | X = 1)}{\\pi^3}$$',
      opts: {},
    })

    const rendered = response.data[0]
    expect(rendered).toContain('viewBox')
    expect(rendered).toContain('preserveAspectRatio')
    expect(rendered).not.toContain('view-box')
    expect(rendered).not.toContain('preserve-aspect-ratio')
  })
})

describe('LaTeX endpoint', () => {
  it('accepts POSTed markdown', async () => {
    const response = await a.post(latex, {md: '# foo', opts: {}})
    expect(response.status).toBe(200)

    const [string, metadata] = response.data
    expect(string).toMatchSnapshot()
    expect(metadata.disableToc).toBe(false)
  })

  it('does not disable TOC', async () => {
    const response = await a.post(latex, {md: '# foo', opts: {}})

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(false)
  })

  it('disables TOC', async () => {
    const response = await a.post(latex, {md: '*foo*', opts: {}})

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(true)
  })

  it('does not have pings', async () => {
    const response = await a.post(latex, {md: 'waddup @Clem', opts: {}})

    const [rendered, metadata] = response.data
    expect(rendered).toEqual('waddup @Clem\n\n')
    expect(metadata.ping).toBe(undefined)
  })

  it('disables ping', async () => {
    const response = await a.post(latex, {md: 'waddup @Clem', opts: {disable_ping: true}})

    const [rendered, metadata] = response.data
    expect(rendered).not.toContain('class="ping"')
    expect(metadata.ping).toBe(undefined)
  })

  it('only parses inline things', async () => {
    const response = await a.post(latex, {
      md: '# foo\n```js\nwindow\n```',
      opts: {inline: true},
    })

    const [rendered] = response.data
    expect(rendered).not.toContain('<h')
  })

  it('downloads images', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const response = await a.post(latex, {
      md: `![](${u('/static/img.png')})`,
      opts: {inline: true, images_download_dir: destination},
    })


    const [rendered, , messages] = response.data
    expect(messages).toEqual([])

    const regex = /\/([a-zA-Z0-9_-]{7,14})\/([a-zA-Z0-9_-]{7,14})\.(.{1,4})}/
    expect(rendered).toMatch(regex)
    const [, dir, file, ext] = rendered.match(regex)
    return expect(rm(`${destination}/${dir}`, `${file}.${ext}`)).resolves.toBe('ok')
  })
})

describe('Texfile endpoint', () => {
  it('accepts POSTed markdown', async () => {
    const response = await a.post(texfile, {md: '# foo', opts: texfileOpts})
    expect(response.status).toBe(200)

    const [string, metadata] = response.data
    expect(string).toMatchSnapshot()
    expect(string).toContain(
      '\\licence[/tmp/l/by-nc-sa.svg]{CC-BY-NC-SA}' +
      '{https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode}')
    expect(metadata).toEqual({})
  })

  it('does not return metadata', async () => {
    const response = await a.post(texfile, {md: '# foo', opts: texfileOpts})

    const [, metadata] = response.data
    expect(metadata).toEqual({})
  })

  it('does not have pings', async () => {
    const response = await a.post(texfile, {md: 'waddup @Clem', opts: texfileOpts})

    const [rendered, metadata] = response.data
    expect(rendered).toContain('waddup @Clem\n\n')
    expect(metadata.ping).toBe(undefined)
  })

  it('only parses inline things', async () => {
    const response = await a.post(texfile, {
      md: '# foo\n```js\nwindow\n```',
      opts: texfileOpts,
    })

    const [rendered] = response.data
    expect(rendered).not.toContain('<h')
  })

  it('downloads images', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const opts = clone(texfileOpts)
    opts.images_download_dir = destination
    const response = await a.post(texfile, {
      md: `![](${u('/static/img.png')})`,
      opts: opts,
    })

    const [rendered, , messages] = response.data
    expect(messages).toEqual([])

    const regex = /\/([a-zA-Z0-9_-]{7,14})\/([a-zA-Z0-9_-]{7,14})\.(.{1,4})}/
    expect(rendered).toMatch(regex)
    const [, dir, file, ext] = rendered.match(regex)
    return expect(rm(`${destination}/${dir}`, `${file}.${ext}`)).resolves.toBe('ok')
  })
})


describe('EPUB endpoint', () => {
  it('downloads images', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const opts = clone(texfileOpts)
    opts.images_download_dir = destination
    const response = await a.post(epub, {
      md: `![](${u('/static/img.png')})`,
      opts: opts,
    })

    const [rendered, , messages] = response.data
    expect(messages).toEqual([])

    const regex = /\/([a-zA-Z0-9_-]{7,14})\/([a-zA-Z0-9_-]{7,14})\.(.{1,4})"/
    expect(rendered).toMatch(regex)
    const [, dir, file, ext] = rendered.match(regex)
    return expect(rm(`${destination}/${dir}`, `${file}.${ext}`)).resolves.toBe('ok')
  })

  it('copies local images', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const opts = clone(texfileOpts)
    opts.images_download_dir = destination
    opts.local_url_to_local_path = [
      '/foobar',
      `${__dirname.replace('__tests__', 'server/static')}`,
    ]
    const response = await a.post(epub, {
      md: `![](file://tmp/passwd)`,
      opts: opts,
    })

    const [rendered, , messages] = response.data
    expect(messages[0].message).toMatch("Protocol 'file:' not allowed.")

    expect(rendered).toBe('<p><img src="file://tmp/passwd"></p>')
  })
})
