const C_NEWLINE = '\n'
const C_NEWPARAGRAPH = '\n\n'

module.exports = function plugin (classNames = {}) {
  const regex = new RegExp(`->`)
  const endMarkers = ['->', '<-']

  function alignTokenizer (eat, value, silent) {
    const now = eat.now()
    const keep = regex.exec(value)
    if (!keep) return
    if (keep.index !== 0) return

    /* istanbul ignore if - never used (yet) */
    if (silent) return true

    let idx = 0
    let linesToEat = []
    const finishedBlocks = []
    let endMarker = ''
    let canEatLine = true
    let beginBlock = 0
    const content = value.substring(0, value.length)
    while (canEatLine) {
      const next = content.indexOf(C_NEWLINE, idx + 1)
      const lineToEat = next !== -1 ? content.slice(idx, next) : content.slice(idx)
      linesToEat.push(lineToEat)

      // If next = (beginBlock + 2), it's the first marker of the block.
      if (next > (beginBlock + 2) &&
        lineToEat.length >= 2 &&
        endMarkers.indexOf(lineToEat.slice(-2)) !== -1) {
        if (endMarker === '') endMarker = lineToEat.slice(-2)

        finishedBlocks.push(linesToEat.join(C_NEWLINE))

        // Check if another block is following
        if (content.indexOf('->', next) !== (next + 1)) break
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
    const contents = this.tokenizeBlock(stringToEat, now)
    exit()

    const elementType = endMarker === '->' ? 'RightAligned' : 'CenterAligned'
    const rightClassName = classNames.right ? classNames.right : 'align-right'
    const centerClassName = classNames.center ? classNames.center : 'align-center'
    const className = endMarker === '->' ? rightClassName : centerClassName
    return add({
      type: elementType,
      children: contents,
      data: {
        hName: 'div',
        hProperties: {
          class: className
        }
      }
    })
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.align_blocks = alignTokenizer
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'align_blocks')
}
