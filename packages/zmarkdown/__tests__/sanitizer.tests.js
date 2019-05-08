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
    const rendered = renderString()('$$\frac{1+1}{x+y}$$')
    expect(rendered).resolves.toMatchSnapshot()
  })
})
