/* eslint-disable no-unused-vars */
const clone = require('clone')
const dedent = require('dedent')

const remarkConfig = clone(require('../config/remark'))
const rebberConfig = clone(require('../config/rebber'))
remarkConfig.noTypography = true
remarkConfig._test = true
remarkConfig.ping.pingUsername = () => false

const zmarkdown = require('../')

const renderString = (config = {remarkConfig, rebberConfig}) => {
  let configToUse = config

  const renderWithConfig = (input) =>
    zmarkdown(configToUse).renderString(input).then((vfile) =>
      vfile.toString().trim())

  if (typeof config === 'string') {
    const input = config
    configToUse = {remarkConfig, rebberConfig}
    return renderWithConfig(input)
  }
  return renderWithConfig
}

const renderFile = (config = {remarkConfig, rebberConfig}) =>
  (input) =>
    zmarkdown(config).renderFile(input).then((vfile) => vfile.toString())

/* jest */
const HtmlDiffer = require('html-differ').HtmlDiffer
const htmlDiffer = new HtmlDiffer({
  ignoreWhitespaces: true,
})
const logger = require('html-differ/lib/logger')

expect.extend({
  toHTML (received, expected) {
    const pass = htmlDiffer.isEqual(received, expected)
    const diff = htmlDiffer.diffHtml(expected, received)
    const diffString = logger.getDiffText(diff)

    const message = pass
      ? () => `${this.utils.matcherHint('.not.toHTML')}\n\n` +
        `Expected value to not be:\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(received)}${
          diffString ? `\n\nDifference:\n\n${diffString}` : ''}`
      : () => {
        return `${this.utils.matcherHint('.toHTML')}\n\n` +
        `Expected value to be:\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(received)}${
          diffString ? `\n\nDifference:\n\n${diffString}` : ''}`
      }

    return {actual: received, message, pass}
  },
})

describe('math', () => {
  it('must escape a dollar with backslash', () => {
    const markdown = '$\\alpha\\$'

    expect(renderString(markdown)).resolves.not.toMatch('inlineMath')
  })


  it('must not parse a raw starting dollar', () => {
    const markdown = '`$`\\alpha$'

    expect(renderString(markdown)).resolves.not.toMatch('inlineMath')
  })

  it('must not parse a raw ending dollar', () => {
    const markdown = '$\\alpha`$` foo'

    expect(renderString(markdown)).resolves.not.toMatch('inlineMath')
  })

  it("must not parse what's inside inline maths as markdown", () => {
    const markdown = '$`\\alpha`$'

    expect(renderString(markdown)).resolves.not.toMatch('<pre')
  })
})

describe('pedantic', () => {
  it('must not parse * and _ surrounded by spaces', () => {
    const markdown = 'a * b * c'

    expect(renderString(markdown)).resolves.not.toMatch('strong')
  })
})

const maxNesting = remarkConfig.maxNesting
describe('depth checks', () => {
  it(`is fast enough with ${maxNesting} nested quotes`, () => {
    const fs = require('fs')
    const base = ['foo', '\n']
    const input = Array.from({length: maxNesting}).reduce((acc, _, i) => {
      return acc + base.map((x, j) => ('>'.repeat(i) + ((i && !j && ' ') || '') + x)).join('\n')
    }, '')

    const a = Date.now()
    const render = renderString(input).then((ok, fail) => {
      const b = Date.now()
      if ((b - a) < 2000) return Promise.resolve('ok')
      return Promise.reject(`Rendering ${maxNesting} nest blockquotes took too long: ${b - a}ms.`)
    })

    return expect(render).resolves.toBe('ok')
  })

  it(`fails with > ${maxNesting} nested quotes`, () => {
    const fs = require('fs')
    const base = ['foo', '\n']
    const input = Array.from({length: maxNesting + 1}).reduce((acc, _, i) => {
      return acc + base.map((x, j) => ('>'.repeat(i) + ((i && !j && ' ') || '') + x)).join('\n')
    }, '')

    return expect(
      renderString(input).catch((err) => Promise.reject(err.message))
    ).rejects.toContain(`Markdown AST too complex: tree depth > ${maxNesting}`)
  })
})

describe('tables', () => {
  it(`with pipes in code in cells`, () => {
    const input = dedent`
      Titre 1 | Titre 2
      --------|--------
      \`ici ok\`| \`gauche | droite\`
    `

    return expect(renderString(input)).resolves.toContain('<td><code>gauche | droite</code></td>')
  })

  it(`with escaped pipes in code in cells`, () => {
    const input = dedent`
      Titre 1 | Titre 2
      --------|--------
      \`ici ok\`| \`gauche \| droite\`
    `

    return expect(renderString(input)).resolves.toContain('<td><code>gauche \\| droite</code></td>')
  })
})

describe('images become figures:', () => {
  it('works with only an image', () => {
    const input = dedent`
      ![wrapped into _figure_](http://blabla.fr)`
    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it('does not apply to images not alone in a block', async () => {
    const input = dedent`
      ![wrapped into figure](http://blabla.fr)
      one image`

    expect(await renderString(input)).not.toContain('<figure')

    const input2 = dedent`
      one image
      ![wrapped into figure](http://blabla.fr)`

    expect(await renderString(input2)).not.toContain('<figure')
  })

  it('does not apply to images without [alt]', async () => {
    const input = dedent`![](http://example.com)`

    expect(await renderString(input)).not.toContain('<figure')
  })

  it('does not transform inline images', async () => {
    const input = dedent`
      one image ![not wrapped into figure because inline](http://blabla.fr)
    `
    expect(await renderString(input)).not.toContain('<figure')
  })

  it('does not apply when a caption is present', async () => {
    const input = dedent`
      ![foo](http://example.com)

      ![](http://example.com)
      Figure: Caption

      ![foo](http://example.com)
      Figure: Caption

      ![](http://example.com)
      Figure:
    `
    const result = await renderString(input)

    expect(result).not.toContain('<p><figure')
    expect(result).toMatchSnapshot()
  })
})

describe('ping', () => {
  it(`does not ping when email adress`, () => {
    remarkConfig.ping.pingUsername = (_username) => true

    const input = dedent`
      @test
      
      I summon @test!
      
      My email address is test@test.com.
    `

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })
})
