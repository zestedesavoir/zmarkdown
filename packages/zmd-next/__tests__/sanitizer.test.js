const {
  defaultMdastConfig,
  renderString,
} = require('../utils/renderer-tests')

describe('#ping', () => {
  beforeEach(() => {
    defaultMdastConfig.ping.pingUsername = () => true
  })

  it('do not oversanitize ping', async () => {
    const rendered = await renderString('@Clem')
    expect(rendered).toContain('class="ping ping-link"')
    expect(rendered).toContain('class="ping-username"')
  })

  afterEach(() => {
    defaultMdastConfig.ping.pingUsername = () => false
  })
})

describe('#math', () => {
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
