const a = require('axios')
const dedent = require('dedent')

const u = (path) => `http://localhost:27272${path}`
const html = u('/html')
const latex = u('/latex')

describe('Regression tests', () => {
  describe('HTML endpoint', () => {
    test('#188 It does not crash on unsupported languages fenced code blocks', async () => {
      const response = await a.post(html, {
        md: [
          '# foo',
          '',
          '```foobar',
          'console.error("foo", true)',
          '```',
          '',
          '```js',
          'console.error("foo", true)',
          '```',
        ].join('\n'),
        opts: {},
      })

      const [rendered] = response.data
      expect(rendered).toMatchSnapshot()
    })

    test('SVG camelCase attributes', async () => {
      const response = await a.post(html, {
        md: [
          '$\\hat \\theta_{MC} = \\frac{\\sum_{i = 1}^n P(Y_i | X = 1)}{\\pi^3}$',
          '',
          '### normal',
          '',
          '$$\\hat \\theta_{MC} = \\sqrt{\\frac{\\sum_{i = 1}^n P(Y_i | X = 1)}{\\pi^3}}$$',
          '',
          '### display',
          '',
          '$$',
          '\\hat \\theta_{MC} = \\frac{\\sum_{i = 1}^n P(Y_i | X = 1)}{\\pi^3}',
          '$$',
        ].join('\n'),
        opts: {},
      })

      const [rendered] = response.data
      expect(rendered).toContain('viewBox')
      expect(rendered).not.toContain('preserve-aspect-ratio')
      expect(rendered).toContain('preserveAspectRatio')
      expect(rendered).not.toContain('preserve-aspect-ratio')
    })
  })

  describe('Latex endpoint', () => {
    test('It wraps image basenames containing dots', async () => {
      const response = await a.post(latex, {
        md: dedent`
          ![](x.yz.png)

          [![foo](/a/w.x.y.z.png)](http://example.com)

          ![](/w.x.y.z.png)

          ![](/foo.bar/x.yz.png)
        `,
        opts: {},
      })

      const [rendered] = response.data
      expect(rendered).toMatchSnapshot()
    })
  })
})
