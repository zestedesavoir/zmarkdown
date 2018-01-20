/* eslint-disable no-unused-vars */
const clone = require('clone')

const remarkConfig = clone(require('../config/remark'))
const rebberConfig = clone(require('../config/rebber'))
remarkConfig.noTypography = true
remarkConfig._test = true
remarkConfig.ping.pingUsername = () => false

const zmarkdown = require('../')

const renderString = (config = {remarkConfig, rebberConfig}) => {
  let configToUse = config

  const renderWithConfig = (input) =>
    zmarkdown(configToUse).renderString(input).then((vfile) =>
      vfile.toString().trim())

  if (typeof config === 'string') {
    const input = config
    configToUse = {remarkConfig, rebberConfig}
    return renderWithConfig(input)
  }
  return renderWithConfig
}

const renderFile = (config = {remarkConfig, rebberConfig}) =>
  (input) =>
    zmarkdown(config).renderFile(input).then((vfile) => vfile.toString())

/* jest */
const HtmlDiffer = require('html-differ').HtmlDiffer
const htmlDiffer = new HtmlDiffer({
  ignoreWhitespaces: true,
})
const logger = require('html-differ/lib/logger')

expect.extend({
  toHTML (received, expected) {
    const pass = htmlDiffer.isEqual(received, expected)
    const diff = htmlDiffer.diffHtml(expected, received)
    const diffString = logger.getDiffText(diff)

    const message = pass
      ? () => `${this.utils.matcherHint('.not.toHTML')}\n\n` +
        `Expected value to not be:\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(received)}${
          diffString ? `\n\nDifference:\n\n${diffString}` : ''}`
      : () => {
        return `${this.utils.matcherHint('.toHTML')}\n\n` +
        `Expected value to be:\n` +
        `  ${this.utils.printExpected(expected)}\n` +
        `Received:\n` +
        `  ${this.utils.printReceived(received)}${
          diffString ? `\n\nDifference:\n\n${diffString}` : ''}`
      }

    return {actual: received, message, pass}
  },
})

describe('math', () => {
  it('must escape a dollar with backslash', () => {
    const markdown = '$\\alpha\\$'

    expect(renderString(markdown)).resolves.not.toMatch('inlineMath')
  })


  it('must not parse a raw starting dollar', () => {
    const markdown = '`$`\\alpha$'

    expect(renderString(markdown)).resolves.not.toMatch('inlineMath')
  })

  it('must not parse a raw ending dollar', () => {
    const markdown = '$\\alpha`$` foo'

    expect(renderString(markdown)).resolves.not.toMatch('inlineMath')
  })

  it("must not parse what's inside inline maths as markdown", () => {
    const markdown = '$`\\alpha`$'

    expect(renderString(markdown)).resolves.not.toMatch('<pre')
  })
})

describe('pedantic', () => {
  it('must not parse * and _ surrounded by spaces', () => {
    const markdown = 'a * b * c'

    expect(renderString(markdown)).resolves.not.toMatch('strong')
  })
})
