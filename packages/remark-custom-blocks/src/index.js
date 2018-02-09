const spaceSeparated = require('space-separated-tokens')

function escapeRegExp (str) {
  return str.replace(/[-[]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

const C_NEWLINE = '\n'
const C_FENCE = '|'

module.exports = function blockPlugin (availableBlocks = {}) {
  const pattern = Object
    .keys(availableBlocks)
    .map(escapeRegExp)
    .join('|')

  if (!pattern) {
    throw new Error('remark-custom-blocks needs to be passed a configuration object as option')
  }

  const regex = new RegExp(`\\[\\[(${pattern})(?: *\\| *(.*))?\\]\\]`)

  function blockTokenizer (eat, value, silent) {
    const now = eat.now()
    const keep = regex.exec(value)
    if (!keep) return
    if (keep.index !== 0) return
    const [eaten, blockType, blockTitle] = keep

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    const linesToEat = []
    const content = []

    let idx = 0
    while ((idx = value.indexOf(C_NEWLINE)) !== -1) {
      const next = value.indexOf(C_NEWLINE, idx + 1)
      // either slice until next NEWLINE or slice until end of string
      const lineToEat = next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1)
      if (lineToEat[0] !== C_FENCE) break
      // remove leading `FENCE ` or leading `FENCE`
      const line = lineToEat.slice(lineToEat.startsWith(`${C_FENCE} `) ? 2 : 1)
      linesToEat.push(lineToEat)
      content.push(line)
      value = value.slice(idx + 1)
    }

    const contentString = content.join(C_NEWLINE)
    const stringToEat = eaten + C_NEWLINE + linesToEat.join(C_NEWLINE)

    const potentialBlock = availableBlocks[blockType]
    const titleAllowed = potentialBlock.title &&
      ['optional', 'required'].includes(potentialBlock.title)
    const titleRequired = potentialBlock.title && potentialBlock.title === 'required'

    if (titleRequired && !blockTitle) return
    if (!titleAllowed && blockTitle) return
    const add = eat(stringToEat)

    const exit = this.enterBlock()
    const contents = {
      type: `${blockType}CustomBlockBody`,
      data: {
        hName: 'div',
        hProperties: {
          className: 'custom-block-body',
        },
      },
      children: this.tokenizeBlock(contentString, now),
    }
    exit()

    const blockChildren = [contents]
    if (titleAllowed && blockTitle) {
      const titleNode = {
        type: `${blockType}CustomBlockHeading`,
        data: {
          hName: 'div',
          hProperties: {
            className: 'custom-block-heading',
          },
        },
        children: this.tokenizeInline(blockTitle, now),
      }
      blockChildren.unshift(titleNode)
    }

    const classList = spaceSeparated.parse(potentialBlock.classes || '')

    return add({
      type: `${blockType}CustomBlock`,
      children: blockChildren,
      data: {
        hName: 'div',
        hProperties: {
          className: ['custom-block', ...classList],
        },
      },
    })
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.customBlocks = blockTokenizer
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'customBlocks')

  // Inject into interrupt rules
  const interruptParagraph = Parser.prototype.interruptParagraph
  const interruptList = Parser.prototype.interruptList
  const interruptBlockquote = Parser.prototype.interruptBlockquote
  interruptParagraph.splice(interruptParagraph.indexOf('fencedCode') + 1, 0, ['customBlocks'])
  interruptList.splice(interruptList.indexOf('fencedCode') + 1, 0, ['customBlocks'])
  interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode') + 1, 0, ['customBlocks'])
}
