/* eslint-disable max-len */
const clone = require('clone')
const dedent = require('dedent')
const a = require('axios')
const fs = require('fs')
const xtend = require('xtend')
const u = (path) => `http://localhost:27272${path}`
const epub = u('/epub')
const html = u('/html')
const latex = u('/latex')
const texfile = u('/latex-document')
const texfileOpts = {
  content_type:      'contentType',
  title:             'The Title',
  authors:           ['FØØ', 'Bär'],
  license:           'CC-BY-NC-SA',
  license_logo:      'by-nc-sa.svg',
  license_url:       'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
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
      md:   '# foo\n```js\nwindow\n```',
      opts: {inline: true},
    })

    const [rendered, {languages}] = response.data
    expect(rendered).not.toContain('<h')
    expect(languages).toEqual([])
  })

  it('can disable tokenizers', async () => {
    const response = await a.post(html, {
      md:   '# foo\nhello bar!',
      opts: {disable_tokenizers: {block: ['atxHeading']}},
    })

    const [rendered] = response.data
    expect(rendered).not.toContain('<h')
  })

  it('can disable tokenizers in inline mode', async () => {
    const response = await a.post(html, {
      md:   '# foo\n*hello bar!*',
      opts: {
        inline:             true,
        disable_tokenizers: {inline: ['emphasis']},
      },
    })

    const [rendered, {languages}] = response.data
    expect(rendered).not.toContain('<h')
    expect(rendered).not.toContain('<em')
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
      md:   '<-- x -->',
      opts: {},
    })

    const rendered = response.data[0]
    expect(rendered).toBe('<p>&#x3C;— x —></p>')
  })

  it('produces statistics when configured', async () => {
    const text = dedent(`
    7 chars
    # 13 chars here
    
    [13 chars here](https.//github.com/zestedesavoir/zmarkdown)
    
    ![13 chars here](https.//github.com/zestedesavoir/zmarkdown)
    
    ![no chars here](https.//github.com/zestedesavoir/zmarkdown)
    Figure: 13 chars here
    `)
    const response = await a.post(html, {md: text, opts: {stats: true}})
    expect(response.status).toBe(200)

    const [string, metadata] = response.data
    expect(string).toMatchSnapshot()
    expect(metadata.stats.signs).toBe(59)
    expect(metadata.stats.words).toBe(14)
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
      md:   '# foo\n```js\nwindow\n```',
      opts: {inline: true},
    })

    const [rendered] = response.data
    expect(rendered).not.toContain('<h')
  })

  it('downloads images', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const response = await a.post(latex, {
      md:   `![](${u('/static/img.png')})`,
      opts: {inline: true, images_download_dir: destination},
    })

    const [rendered, , messages] = response.data
    expect(messages).toEqual([])

    const regex = /\/([a-zA-Z0-9_-]{7,14})\/([a-zA-Z0-9_-]{7,14})\.(.{1,4})}/
    expect(rendered).toMatch(regex)
    const [, dir, file, ext] = rendered.match(regex)
    return expect(rm(`${destination}/${dir}`, `${file}.${ext}`)).resolves.toBe('ok')
  })

  it('properly defaults image', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const response = await a.post(latex, {
      md:   `![](${u('/static/noimage.png')})`,
      opts: {inline: true, images_download_dir: destination},
    })

    const rendered = response.data[0]
    expect(rendered).toContain('black.png')
  })

  it('properly defaults image with custom path', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const response = await a.post(latex, {
      md:   `![](${u('/static/noimage.png')})`,
      opts: {
        inline:                  true,
        images_download_dir:     destination,
        images_download_default: 'default.png',
      },
    })

    const rendered = response.data[0]
    expect(rendered).toContain('default.png')
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

  it('escapes title and author', async () => {
    const titleOpts = {authors: ['titi_alone'], title: 'recap #1'}
    const response = await a.post(texfile,
      {md: '# foo', opts: xtend(texfileOpts, titleOpts)})
    expect(response.status).toBe(200)

    const result = response.data
    expect(result[0]).toMatchSnapshot()
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
      md:   '# foo\n```js\nwindow\n```',
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
      md:   `![](${u('/static/img.png')})`,
      opts: opts,
    })

    const [rendered, , messages] = response.data
    expect(messages).toEqual([])

    const regex = /\/([a-zA-Z0-9_-]{7,14})\/([a-zA-Z0-9_-]{7,14})\.(.{1,4})}/
    expect(rendered).toMatch(regex)
    const [, dir, file, ext] = rendered.match(regex)
    return expect(rm(`${destination}/${dir}`, `${file}.${ext}`)).resolves.toBe('ok')
  })

  it('allows extra arguments', async () => {
    const additionalOpts = {
      logo_directory: '/tmp/logo',
      content_logo:   'h2g2.png',
      content_link:   'https://en.wikipedia.org/wiki/The_Hitchhiker%27s_Guide_to_the_Galaxy_(novel)',
      editor_logo:    'pmm.jpg',
      editor_link:    'https://www.panmacmillan.com/',
    }
    const opts = Object.assign({}, texfileOpts, additionalOpts)
    const response = await a.post(texfile, {md: '# foo', opts})
    expect(response.status).toBe(200)

    const [string] = response.data
    expect(string).toMatchSnapshot()
    expect(string).toContain(dedent`\logo{/tmp/logo/h2g2.png}
    \editorLogo{/tmp/logo/pmm.jpg}
    \tutoLink{https://en.wikipedia.org/wiki/The_Hitchhiker%27s_Guide_to_the_Galaxy_(novel)}
    \editor{https://www.panmacmillan.com/}`)
  })
})


describe('EPUB endpoint', () => {
  it('downloads images', async () => {
    const destination = process.env.DEST || `${__dirname}/../public/`
    const opts = clone(texfileOpts)
    opts.images_download_dir = destination
    const response = await a.post(epub, {
      md:   `![](${u('/static/img.png')})`,
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
      md:   `![](file://tmp/passwd)`,
      opts: opts,
    })

    const [rendered, , messages] = response.data
    expect(messages[0].message).toMatch("Protocol 'file:' not allowed.")

    expect(rendered).toBe('<p><img></p>')
  })
})
