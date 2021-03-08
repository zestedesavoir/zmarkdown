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

    test('#431 It uses random footnote postfix correctly', async () => {
      const md = dedent`
        hello[^foo] world[^bar]

        [^foo]: foo
        [^bar]: bar
      `

      const firstResponse = await a.post(html, {
        md,
        opts: {},
      })

      const secondResponse = await a.post(html, {
        md,
        opts: {},
      })

      const [firstRendered] = firstResponse.data
      const [secondRendered] = secondResponse.data

      const firstFooReference = firstRendered.match(/fnref-1-([a-zA-Z0-9-_]+)/)
      const firstFooDefinition = firstRendered.match(/fn-1-([a-zA-Z0-9-_]+)/)
      const firstBarReference = firstRendered.match(/fnref-2-([a-zA-Z0-9-_]+)/)
      const secondBarDefinition = secondRendered.match(/fn-2-([a-zA-Z0-9-_]+)/)

      // A unique token shall be generated for a given footnote
      expect(firstFooReference[1]).toEqual(firstFooDefinition[1])
      // But also for a given render
      expect(firstFooReference[1]).toEqual(firstBarReference[1])

      // Finally, we expect tokens to differ between two successive renderings
      expect(secondBarDefinition[1]).not.toEqual(firstBarReference[1])
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
