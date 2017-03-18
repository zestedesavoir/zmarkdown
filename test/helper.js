const HtmlDiffer = require('html-differ').HtmlDiffer
const htmlDiffer = new HtmlDiffer({
  ignoreWhitespaces: true
})
const logger = require('html-differ/lib/logger')

module.exports = (chai) => {
  chai.Assertion.addMethod('html', function (right) {
    const left = this._obj
    const isSameHtml = htmlDiffer.isEqual(left, right)
    const diff = htmlDiffer.diffHtml(right, left)
    const diffResult = logger.getDiffText(diff)

    this.assert(
      isSameHtml,
      `Green is extra, red is missing:\n${diffResult}`,
      `Red is extra, green is missing:\n${diffResult}`,
      right,
      left
    )
  })
}
