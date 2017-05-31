const SPACE = ' '
const markers = {
  '~': 'sub',
  '^': 'sup',
}

function locator (value, fromIndex) {
  let index = -1
  for (const marker of Object.keys(markers)) {
    index = value.indexOf(marker, fromIndex)
    if (index !== -1) return index
  }

  return index
}

function inlinePlugin () {
  function inlineTokenizer (eat, value, silent) {
    // allow escaping of all markers
    for (const marker of Object.keys(markers)) {
      if (!this.escape.includes(marker)) this.escape.push(marker)
    }

    const marker = value[0]
    const now = eat.now()
    now.column += 1
    now.offset += 1

    if (markers.hasOwnProperty(marker) &&
      !value.startsWith(marker + SPACE) &&
      !value.startsWith(marker + marker)
    ) {
      let endMarkerIndex = 1
      for (; value[endMarkerIndex] !== marker && endMarkerIndex < value.length; endMarkerIndex++);

      // if it's actually empty, don't tokenize (disallows e.g. <sup></sup>)
      if (endMarkerIndex === value.length) return

      /* istanbul ignore if - never used (yet) */
      if (silent) return true

      eat(value.substring(0, endMarkerIndex + 1))({
        type: markers[marker],
        children: this.tokenizeInline(value.substring(1, endMarkerIndex), now),
        data: {
          hName: markers[marker],
        },
      })
    }
  }

  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.sub_super = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'sub_super')
}

module.exports = inlinePlugin
