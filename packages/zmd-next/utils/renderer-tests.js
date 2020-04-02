const clone = require('clone')

const zmarkdown = require('../common')

const defaultMdastConfig = clone(require('../config/mdast'))
const defaultHtmlConfig = clone(require('../config/html'))

defaultMdastConfig.disabledPlugins = {
  internal: ['textr'],
  meta: [],
  inline: [],
}
defaultMdastConfig.ping.pingUsername = () => false

defaultHtmlConfig.disabledPlugins = {
  internal: ['lineNumbers', 'highlight'],
}
defaultHtmlConfig.postfixFootnotes = '-shortId'

module.exports.defaultMdastConfig = defaultMdastConfig

module.exports.defaultHtmlConfig = defaultHtmlConfig

module.exports.configOverride = (a, b) => Object.assign({}, a, b)

module.exports.renderString = (mdastConfig, htmlConfig) => {
  let usedMdastConfig = mdastConfig
  let usedHtmlConfig = htmlConfig

  const renderWithConfig = (input, vfile) => {
    if (!vfile) {
      return zmarkdown('html', usedMdastConfig, usedHtmlConfig)(input)
        .then(vfile => vfile.contents.trim())
    } else {
      return zmarkdown('html', usedMdastConfig, usedHtmlConfig)(input)
    }
  }

  // Handle case where no config was given
  if (typeof mdastConfig === 'string') {
    usedMdastConfig = defaultMdastConfig
    usedHtmlConfig = defaultHtmlConfig

    return renderWithConfig(mdastConfig, htmlConfig)
  }

  return renderWithConfig
}
