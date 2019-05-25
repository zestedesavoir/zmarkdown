const remarkConfig = require('../config/remark')
const rebberConfig = require('../config/rebber')

// Disable typographical corrections for easier testing
remarkConfig.noTypography = true
remarkConfig._test = true

const zmarkdown = require('../server')

const renderString = (config = {remarkConfig, rebberConfig}) =>
  (input) =>
    zmarkdown(config).renderString(input).then((vfile) =>
      vfile.toString().trim())

describe('#ping', () => {
  it('do not oversanitize ping', () => {
    const rendered = renderString()('@Clem')
    expect(rendered).resolves.toContain('class="ping ping-link"')
    expect(rendered).resolves.toContain('class="ping-username"')
  })
})

describe('#math', () => {
  it('do not oversanitize math - test sub/sup', () => {
    const rendered = renderString()('$$1_n + 1^n$$')
    expect(rendered).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test frac', () => {
    const rendered = renderString()('$$\\frac{1+1}{x+y}$$')
    expect(rendered).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test sqrt', () => {
    const rendered = renderString()('$$\\sqrt[3]{x^3 + y^3 + z^3}$$')
    expect(rendered).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test notin', () => {
    const rendered = renderString()('$$\\notin$$')
    expect(rendered).resolves.toMatchSnapshot()
  })

  it('do not oversanitize math - test overrightarrow', () => {
    const rendered = renderString()('$$\\overrightarrow{AB}$$')
    expect(rendered).resolves.toMatchSnapshot()
  })
})
