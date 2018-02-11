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
