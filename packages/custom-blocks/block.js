function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
}

const C_NEWLINE = '\n'
const C_FENCE = '|'

module.exports = (blocks) => function blockPlugin (opts = {}) {
  const pattern = Object
    .keys(blocks)
    .map(escapeRegExp)
    .join('|')
  const regex = new RegExp(`\\[\\[(${pattern})\\]\\]`)

  function blockTokenizer (eat, value, silent) {
    const keep = regex.exec(value)

    if (!keep) return
    if (keep.index !== 0) return
    if (value.indexOf('[[') !== 0) return

    const eaten = []
    const content = []

    let idx = 0
    while ((idx = value.indexOf(C_NEWLINE)) !== -1) {
      const next = value.indexOf(C_NEWLINE, idx + 1)
      // either slice until next NEWLINE or slice until end of string
      const lineToEat = next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1)
      if (lineToEat[0] !== C_FENCE) break
      // remove leading `FENCE ` or leading `FENCE`
      const line = lineToEat.slice(lineToEat.startsWith(`${C_FENCE} `) ? 2 : 1)
      eaten.push(lineToEat)
      content.push(line)
      value = value.slice(idx + 1)
    }

    const contentString = content.join(C_NEWLINE)
    const eatenString = `${keep[0]}\n${eaten.join(C_NEWLINE)}`

    return eat(eatenString)({
      type: 'custom',
      value: contentString,
      data: {
        hName: 'div',
        hProperties: {
          className: keep[1]
        },
        hChildren: [
          {
            type: 'text',
            value: contentString
          }
        ]
      }
    })
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.custom_blocks = blockTokenizer
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'custom_blocks')

  // // Inject math to interrupt rules
  // const interruptParagraph = Parser.prototype.interruptParagraph
  // const interruptList = Parser.prototype.interruptList
  // const interruptBlockquote = Parser.prototype.interruptBlockquote
  // interruptParagraph.splice(interruptParagraph.indexOf('fencedCode') + 1, 0, ['math'])
  // interruptList.splice(interruptList.indexOf('fencedCode') + 1, 0, ['math'])
  // interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode') + 1, 0, ['math'])
}
