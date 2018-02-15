const spaceSeparated = require('space-separated-tokens')

const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

module.exports = function plugin (classNames = {}) {
  const regex = new RegExp(`[^\\\\]?(->|<-)`)
  const endMarkers = ['->', '<-']

  function alignTokenizer (eat, value, silent) {
    const now = eat.now()
    const keep = regex.exec(value)
    if (!keep) return
    if (keep.index !== 0) return

    const startMarker = keep[1]

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    let idx = 0
    let linesToEat = []
    const finishedBlocks = []
    let endMarker = ''
    let canEatLine = true
    let beginBlock = 0
    while (canEatLine) {
      const next = value.indexOf(C_NEWLINE, idx + 1)
      const lineToEat = next !== -1 ? value.slice(idx, next) : value.slice(idx)
      // Get if we found an escaped end marker.
      const escaped = lineToEat.length > 2 && lineToEat[lineToEat.length - 3] === '\\'
      linesToEat.push(lineToEat)

      // If next = (beginBlock + 2), it's the first marker of the block.
      if (!escaped &&
        (next > (beginBlock + 2) || next === -1) &&
        lineToEat.length >= 2 &&
        endMarkers.indexOf(lineToEat.slice(-2)) !== -1) {


        if (endMarker === '') endMarker = lineToEat.slice(-2)

        finishedBlocks.push(linesToEat.join(C_NEWLINE))

        // Check if another block is following
        if (value.indexOf('->', next) !== (next + 1)) break
        linesToEat = []
        beginBlock = next + 1
      }

      idx = next + 1
      canEatLine = next !== -1
    }

    if (finishedBlocks.length === 0) return
    let stringToEat = ''
    const marker = finishedBlocks[0].substring(finishedBlocks[0].length - 2,
      finishedBlocks[0].length)
    const toEat = []
    for (let i = 0; i < finishedBlocks.length; ++i) {
      const block = finishedBlocks[i]
      if (marker !== block.substring(block.length - 2, block.length)) break
      toEat.push(block)
      stringToEat += block.slice(2, -2) + C_NEWPARAGRAPH
    }

    const add = eat(toEat.join(C_NEWLINE))
    const exit = this.enterBlock()
    const values = this.tokenizeBlock(stringToEat, now)
    exit()

    let elementType
    let classes
    if (startMarker === '<-' && endMarker === '<-') {
      elementType = 'leftAligned'
      classes = classNames.left ? classNames.left : 'align-left'
    }
    if (startMarker === '->') {
      if (endMarker === '<-') {
        elementType = 'centerAligned'
        classes = classNames.center ? classNames.center : 'align-center'
      }
      if (endMarker === '->') {
        elementType = 'rightAligned'
        classes = classNames.right ? classNames.right : 'align-right'
      }
    }

    return add({
      type: elementType,
      children: values,
      data: {
        hName: 'div',
        hProperties: {
          class: spaceSeparated.parse(classes),
        },
      },
    })
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.align_blocks = alignTokenizer
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'align_blocks')

  const Compiler = this.Compiler

  // Stringify
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    const alignCompiler = function (node) {
      const innerContent = this.all(node)

      const markers = {
        left: ['<-', '<-'],
        right: ['->', '->'],
        center: ['->', '<-'],
      }
      const alignType = node.type.slice(0, -7)

      if (!markers[alignType]) return innerContent.join('\n\n')

      const [start, end] = markers[alignType]

      if (innerContent.length < 2) return `${start} ${innerContent.join('\n').trim()} ${end}`

      return `${start}\n${innerContent.join('\n\n').trim()}\n${end}`
    }
    visitors.leftAligned = alignCompiler
    visitors.rightAligned = alignCompiler
    visitors.centerAligned = alignCompiler
  }
}
