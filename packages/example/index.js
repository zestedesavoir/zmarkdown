// https://github.com/Rokt33r/remark-math/blob/master/packages/remark-math/index.js
const inlinePlugin = require('./inline')
const blockPlugin = require('./block')

module.exports = [
  [inlinePlugin],
  [blockPlugin]
]
