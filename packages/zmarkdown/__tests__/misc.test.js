const {
  defaultMdastConfig,
  renderAs,
} = require('../utils/renderer-tests')

const vfile = require('../server/utils/manifest')

const renderString = renderAs('html')

describe('sanitizer', () => {
  it('do not oversanitize ping', async () => {
    defaultMdastConfig.ping.pingUsername = () => true

    const rendered = await renderString('@Clem')
    expect(rendered).toContain('class="ping ping-link"')
    expect(rendered).toContain('class="ping-username"')

    defaultMdastConfig.ping.pingUsername = () => false
  })

  it('do not oversanitize math - test sub/sup', () => {
    expect(renderString('$$1_n + 1^n$$')).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test frac', () => {
    expect(renderString('$$\\frac{1+1}{x+y}$$')).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test sqrt', () => {
    expect(renderString('$$\\sqrt[3]{x^3 + y^3 + z^3}$$')).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test notin', () => {
    expect(renderString('$$\\notin$$')).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test overrightarrow', () => {
    expect(renderString('$$\\overrightarrow{AB}$$')).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test vec', () => {
    expect(renderString('$$\\vec{a}$$')).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test color', () => {
    expect(renderString('$$\\color{red}{x}$$')).resolves.toMatchSnapshot()
  })
})

describe('manifest utils', () => {
  it('assembles content-only vfile', () => {
    const res = vfile.assemble({contents: 'aa'}, {contents: 'bb'})

    expect(res.contents).toEqual('aa\nbb')
    // Check messages are dropped
    expect(res.messages).toEqual([])
  })

  it('assembles vfile with messages', () => {
    const messages = [
      'I dream\'d a dream to-night.',
      'And so did I.',
      'Well, what was yours?',
      'That dreamers often lie.',
    ]

    const res = vfile.assemble(
      {messages: [messages[0], messages[1]]},
      {messages: [messages[2], messages[3]]},
    )

    expect(res.messages).toEqual(messages)
  })

  it('assembles properties - big test', () => {
    const res = vfile.assemble(
      {data: {
        disableToc: true,
        stats:      {signs: 16, words: 4},
        ping:       ['Romeo', 'Juliet'],
      }},
      {data: {
        languages: ['html', 'js'],
        stats:     {signs: 15, words: 3},
        ping:      ['Romeo', 'Mercutio'],
      }},
    )

    expect(res.data).toEqual({
      disableToc: true,
      languages:  ['html', 'js'],
      stats:      {signs: 31, words: 7},
      ping:       ['Romeo', 'Juliet', 'Mercutio'],
    })
  })

  it('assembles properties - unique property', () => {
    const res = vfile.assemble(
      {data: {
        disableToc: true,
      }},
      {data: {
        disableToc: false,
      }},
    )

    expect(res.data).toEqual({
      disableToc: false,
    })
  })

  it('gather extracts', () => {
    const extracts = ['introduction', '# foo\n\nHello @you', 'Foobar', 'Barfoo']

    const manifest = {
      introduction: extracts[0],
      children:     [{text: extracts[2]}, {text: extracts[3]}],
      text:         extracts[1],
    }

    return expect(vfile.gatherExtracts(manifest).map(v => v.text)).toEqual(extracts)
  })

  it('dispatch extracts - simple', () => {
    const extracts = ['introduction', '# foo\n\nHello @you', 'Foobar', 'Barfoo']

    const manifest = {
      introduction: 1,
      children:     [{text: 1}, {text: 1}],
      text:         1,
    }

    const expectedManifest = {
      introduction: extracts[0],
      children:     [{text: extracts[2]}, {text: extracts[3]}],
      text:         extracts[1],
    }

    const resultingVfile = vfile.dispatch(extracts.map(v => ({contents: v})), manifest)

    expect(resultingVfile.contents).toEqual(expectedManifest)
  })

  it('dispatch extracts - with data', () => {
    const extracts = ['introduction', '# foo\n\nHello @you', 'Foobar', 'Barfoo']

    const manifest = {
      introduction: 1,
      children:     [{text: 1}, {text: 1}],
      text:         1,
    }

    const resultingVfile = vfile.dispatch(extracts.map((v, i) => ({
      contents: v,
      messages: [`Message ${i}`],
      data:     {
        stats: {words: 2},
      },
    })), manifest)

    expect(resultingVfile.data.stats.words).toEqual(8)
    expect(resultingVfile.messages).toEqual([0, 0, 0, 0].map((_, i) => `Message ${i}`))
  })
})
