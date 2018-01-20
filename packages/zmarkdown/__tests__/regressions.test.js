const a = require('axios')

const u = (path) => `http://localhost:27272${path}`
const html = u('/html')

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
})
