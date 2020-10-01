const clone = require('clone')
const dedent = require('dedent')
const zmarkdown = require('../common')

const trimContent = vfile => vfile.contents.trim()

describe('mdast', () => {
  it('uses default config', () => {
    const parser = zmarkdown(null)

    expect(parser('# some md\n\n@hello')).toMatchSnapshot()
  })

  it('can take custom config', () => {
    const mdastConfig = clone(require('../config/mdast'))
    mdastConfig.ping.pingUsername = _ => false

    const parser = zmarkdown(null, mdastConfig)

    expect(parser('# some md\n\n@hello')).toMatchSnapshot()
  })
})

describe('html', () => {
  it('uses default config', () => {
    const parser = zmarkdown('html')

    expect(parser(dedent`
      # some md

      \`\`\`latex
      Some LaTeX
      \`\`\`
    `).then(trimContent)).resolves.toMatchSnapshot()
  })

  it('can take custom config', () => {
    const mdastConfig = clone(require('../config/mdast'))
    const htmlConfig = clone(require('../config/html'))

    htmlConfig.postProcessors.wrapCode = false

    const parser = zmarkdown('html', mdastConfig, htmlConfig)

    expect(parser(dedent`
      # some md

      \`\`\`latex
      Some LaTeX
      \`\`\`
    `).then(trimContent)).resolves.toMatchSnapshot()
  })
})

describe('latex', () => {
  it('uses default config', () => {
    const parser = zmarkdown('latex')

    expect(parser('# some md').then(trimContent)).resolves.toMatchSnapshot()
  })

  it('can take custom config', () => {
    const mdastConfig = clone(require('../config/mdast'))
    const latexConfig = clone(require('../config/latex'))

    latexConfig.headings[0] = (val) => `\\thisIsNotATitle{${val}}\n`

    const parser = zmarkdown('latex', mdastConfig, latexConfig)

    expect(parser('# some md').then(trimContent)).resolves.toMatchSnapshot()
  })
})

describe('misc', () => {
  it('can use callback', done => {
    const parser = zmarkdown('latex')

    parser('# some md', (err, vfile) => {
      expect(err).toBeNull()
      expect(trimContent(vfile)).toMatchSnapshot()

      done()
    })
  })
})
