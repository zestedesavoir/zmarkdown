module.exports = code

const detab = require('detab')

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

// Parse all attributes on the code block
const attrsHandler = meta => {
  const parsedAttrs = {}

  let currentWord = ''
  let currentProp = ''
  let quotesFlag = false

  for (let charIndex = 0; charIndex < meta.length; charIndex++) {
    const currentChar = meta[charIndex]

    // Spaces are separators
    if (!quotesFlag && currentChar === ' ') {
      parsedAttrs[currentProp] = currentWord
      currentProp = currentWord = ''
    } else if (currentChar === '=') {
      currentProp = currentWord
      currentWord = ''
    // Spaces inside quotes should not break current property
    } else if (currentChar === '"' || currentChar === '\'') {
      quotesFlag = !quotesFlag
    } else {
      currentWord += currentChar
    }
  }

  // Parse the last property if any
  if (currentProp) parsedAttrs[currentProp] = currentWord

  return parsedAttrs
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
      const rangeLength = (currentInt - previousNumber) + 1

      parsedRange.push(...[...Array(rangeLength).keys()]
        .map(i => i + previousNumber))
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
  const value = node.value ? detab(`${node.value}\n`) : ''
  const lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)
  const attrs = attrsHandler(node.meta)

  const linenostart = parseInt(attrs.linenostart) || 1
  // eslint-disable-next-line camelcase
  const hl_lines = rangeHandler(attrs.hl_lines || '')

  const lineNumberElems = value
    .split('\n')
    .slice(0, -1)
    .map((_, i) => {
      const realLn = i + linenostart
      return lineNumberElemConstructor(realLn, hl_lines.includes(realLn))
    })

  return parentDivConstructor([
    lineNumberDivConstructor(lineNumberElems),
    codeNodeConstructor(lang, value),
  ])
}
