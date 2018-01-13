const a = require('axios')

const u = (path) => `http://localhost:27272${path}`

describe('HTML endpoint', () => {
  test('It should accept POSTed markdown', async () => {
    const response = await a.post(u('/html'), { md: '# foo', opts: {} })

    expect(response.status).toBe(200)
    const [string, metadata] = response.data
    expect(string).toMatchSnapshot()
    expect(metadata.disableToc).toBe(false)
  })

  test('It should not disable TOC', async () => {
    const response = await a.post(u('/html'), { md: '# foo', opts: {} })

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(false)
  })

  test('It should disable TOC', async () => {
    const response = await a.post(u('/html'), { md: '*foo*', opts: {} })

    const [, {disableToc}] = response.data
    expect(disableToc).toBe(true)
  })
})
