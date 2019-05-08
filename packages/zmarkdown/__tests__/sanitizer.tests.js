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
  it('do not oversanitive ping', () => {
    const rendered = renderString()('@Clem')
    expect(rendered).resolves.toContain('class="ping ping-link"')
    expect(rendered).resolves.toContain('class="ping-username"')
  })
})

describe('#math', () => {
  it('do not oversanitize math', () => {
    const rendered = renderString()('$$1_n$$')
    expect(rendered).resolves.toMatchSnapshot()
  })
})
