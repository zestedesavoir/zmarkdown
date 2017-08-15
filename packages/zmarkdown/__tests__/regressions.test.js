/* eslint-disable no-unused-vars */
const clone = require('clone')

const defaultConfig = clone(require('../config'))
defaultConfig.noTypography = true
defaultConfig.ping.pingUsername = () => false

const zmarkdown = require('../')

const renderString = (config = defaultConfig) => {
  let configToUse = config

  const renderWithConfig = (input) =>
    zmarkdown(configToUse).renderString(input).content

  if (typeof config === 'string') {
    const input = config
    configToUse = defaultConfig
    return renderWithConfig(input)
  }
  return renderWithConfig
}

const renderFile = (config = defaultConfig) =>
  (input) =>
    zmarkdown(config).renderFile(input).content

const configOverride = (config) => {
  const newConfig = clone(defaultConfig)
  Object.assign(newConfig, config)
  return newConfig
}

/* jest */
const HtmlDiffer = require('html-differ').HtmlDiffer
const htmlDiffer = new HtmlDiffer({
  ignoreWhitespaces: true
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

it('must escape a dollar with backslash', () => {
  const markdown = '$\\alpha\\$'

  expect(renderString(markdown)).not.toMatch('inlineMath')
})


it('must not parse a raw starting dollar', () => {
  const markdown = '`$`\\alpha$'

  expect(renderString(markdown)).not.toMatch('inlineMath')
})

it('must not parse a raw ending dollar', () => {
  const markdown = '$\\alpha`$` foo'

  expect(renderString(markdown)).not.toMatch('inlineMath')
})

it("must not parse what's inside inline maths as markdown", () => {
  const markdown = '$`\\alpha`$'

  expect(renderString(markdown)).not.toMatch('<pre')
})
