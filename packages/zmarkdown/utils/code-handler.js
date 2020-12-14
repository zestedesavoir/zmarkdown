module.exports = code

const attrsParser = require('md-attr-parser')

const codeNodeConstructor = (lang, value) => {
  // no properties, except if a langage is specified
  // remark-highlight takes care of adding the right coloration
  const properties = {}
  if (lang) properties.className = [`language-${lang}`]

  // pre > code(.language-xxx)?
  return {
    type:       'element',
    tagName:    'pre',
    properties: {},
    children:   [{
      type:     'element',
      tagName:  'code',
      properties,
      children: [{
        type: 'text',
        value,
      }],
    }]}
}

// div.hljs-code-div
const parentDivConstructor = children => ({
  type:       'element',
  tagName:    'div',
  properties: {className: ['hljs-code-div']},
  children,
})

// div.hljs-line-numbers
const lineNumberDivConstructor = children => ({
  type:       'element',
  tagName:    'div',
  properties: {className: ['hljs-line-numbers']},
  children,
})

// span[data-count](.hll)?
const lineNumberElemConstructor = (count, hl) => {
  const properties = {'data-count': String(count)}
  if (hl) properties.className = 'hll'

  return {
    type:     'element',
    tagName:  'span',
    properties,
    children: [],
  }
}

// Parse ranges for hl_lines
const rangeHandler = range => {
  const parsedRange = []

  let previousNumber = -1
  let currentNumber = ''

  // Insert a number or range in the list
  function insert () {
    if (previousNumber >= 0) {
      const currentInt = parseInt(currentNumber)
      const previousInt = parseInt(previousNumber)

      const minLineNumber = Math.min(currentInt, previousInt)
      const maxLineNumber = Math.max(currentInt, previousInt)

      const rangeLength = (maxLineNumber - minLineNumber) + 1

      parsedRange.push(...[...Array(rangeLength).keys()]
        .map(i => i + minLineNumber))
    } else {
      parsedRange.push(parseInt(currentNumber))
    }
  }

  for (let charIndex = 0; charIndex < range.length; charIndex++) {
    const currentChar = range[charIndex]
    const currentCharCode = range.charCodeAt(charIndex)

    // Match 0-9
    if (currentCharCode >= 48 && currentCharCode <= 57) {
      currentNumber += currentChar
    } else if (currentChar === '-') {
      previousNumber = parseInt(currentNumber)
      currentNumber = ''
    } else if (currentChar === ' ' || currentChar === ',') {
      insert()

      previousNumber = -1
      currentNumber = ''
    }
  }

  // Parse the last property if any
  if (currentNumber) insert()

  return parsedRange
}

function code (_, node) {
  const value = node.value ? `${node.value}\n` : ''
  const lang = (node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)) || 'text'
  const attrs = attrsParser(node.meta || '').prop

  const linenostart = parseInt(attrs.linenostart) || 1
  const hlLines = rangeHandler(attrs.hl_lines || '')

  const lineNumberElems = value
    .split('\n')
    .slice(0, -1)
    .map((_, i) => {
      const realLn = i + linenostart
      return lineNumberElemConstructor(realLn, hlLines.includes(realLn))
    })

  return parentDivConstructor([
    lineNumberDivConstructor(lineNumberElems),
    codeNodeConstructor(lang, value),
  ])
}
