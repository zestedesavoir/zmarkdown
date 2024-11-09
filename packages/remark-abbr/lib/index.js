import { SKIP, CONTINUE, visit } from 'unist-util-visit'
import { abbr, abbrTypes } from 'micromark-extension-abbr'

function splitTextByAbbr (textNode, abbrDefinitions, seenAbbreviations, opts) {
  const expandFirst = opts.expandFirst || false
  const uniqueAbbreviationMap = new Map()
  for (const abbreviation of abbrDefinitions) {
    uniqueAbbreviationMap.set(abbreviation.identifier, abbreviation)
  }

  const uniqueAbbreviations = [...uniqueAbbreviationMap.values()]

  const matches = uniqueAbbreviations
    .map(
      (abbr) =>
        /** @type {const} */ ([abbr, textNode.value.indexOf(abbr.identifier)])
    )
    .filter(([_abbr, index]) => index >= 0)
    .map(([abbr, index]) => {
      const start = index
      const end = index + abbr.identifier.length - 1
      return {
        abbr,
        start,
        end,
        prevChar: textNode.value[start - 1],
        nextChar: textNode.value[end + 1]
      }
    })
    .filter((match) =>
      // We don't want to match "HTML" inside strings like "HHHHTMLLLLLL", so check that the
      // surrounding characters are either undefined (i.e. start of string / end of string)
      // or non-word characters
      [match.prevChar, match.nextChar].every(
        (c) => c === undefined || /^\W$/.test(c)
      )
    )
    .sort((l, r) => l.start - r.start)
    .map(match => {
      const firstOfItsKind = !seenAbbreviations.has(match.abbr.identifier)
      seenAbbreviations.add(match.abbr.identifier)
      return { ...match, firstOfItsKind }
    })

  if (matches.length === 0) {
    return [textNode]
  }

  const nodes = []
  let currentIndex = 0
  for (const match of matches) {
    if (match.start > currentIndex) {
      nodes.push({
        ...textNode,
        value: textNode.value.slice(currentIndex, match.start),
        position: textNode.position && {
          start: updatePoint(textNode.position.start, currentIndex),
          end: updatePoint(textNode.position.start, match.start)
        }
      })
    }
    const shouldExpand = expandFirst && match.firstOfItsKind
    if (shouldExpand) {
      // Add a text node for the expanded definition, up to the opening paren
      nodes.push({
        ...textNode,
        value: match.abbr.value + ' ('
      })
    }

    const abbrPosition = textNode.position && {
      start: updatePoint(textNode.position.start, match.start),
      end: updatePoint(textNode.position.start, match.end + 1)
    }
    const abbr = {
      type: 'abbr',
      value: match.abbr.value,
      identifier: match.abbr.identifier,
      data: {
        hName: 'abbr',
        hProperties: {
          title: match.abbr.value
        },
        hChildren: [{ type: 'text', value: match.abbr.identifier }]
      },
      position: abbrPosition
    }
    nodes.push(abbr)

    if (shouldExpand) {
      // Add a closing paren text node
      nodes.push({
        type: 'text',
        value: ')'
      })
    }
    // Move the position forwards
    currentIndex = match.end + 1
  }

  // If the final abbreviation wasn't at the very end of the value,
  // add one final text node with the remainder of the value
  if (currentIndex < textNode.value.length) {
    nodes.push({
      ...textNode,
      value: textNode.value.slice(currentIndex),
      position: textNode.position && {
        start: updatePoint(textNode.position.start, currentIndex),
        end: updatePoint(textNode.position.end, 0)
      }
    })
  }

  return nodes

  function updatePoint (point, increment) {
    return {
      line: point.line,
      column: point.column + increment,
      offset:
        point.offset === undefined
          ? undefined
          : point.offset + increment
    }
  }
}

/**
 * Create an extension for `mdast-util-from-markdown` to enable abbreviations
 * in markdown.
 */
export function abbrFromMarkdown (opts) {
  return {
    enter: {
      abbrDefinition: enterAbbrDefinition,
      abbrDefinitionLabel: enterAbbrDefinitionLabel,
      abbrDefinitionValueString: enterAbbrDefinitionValueString
    },
    exit: {
      abbrDefinition: exitAbbrDefinition,
      abbrDefinitionLabel: exitAbbrDefinitionLabel,
      abbrDefinitionValueString: exitAbbrDefinitionValueString
    },
    transforms: [
      (tree) => {
        const abbrDefinitions = tree.children.filter(
          (x) => x.type === abbrTypes.abbrDefinition
        )
        if (abbrDefinitions.length === 0) {
          return tree
        }

        const seenAbbreviations = new Set()
        visit(tree, null, (node, index, parent) => {
          if (index === undefined || parent === undefined) {
            return CONTINUE
          }

          if (node.type === 'text') {
            const newNodes = splitTextByAbbr(node, abbrDefinitions, seenAbbreviations, opts)
            parent.children.splice(index, 1, ...newNodes)
            return SKIP
          }

          return CONTINUE
        })
      }
    ]
  }

  function enterAbbrDefinition (token) {
    this.enter(
      {
        type: abbrTypes.abbrDefinition,
        value: '',
        identifier: ''
      },
      token
    )
  }

  function enterAbbrDefinitionLabel () {
    this.buffer()
  }

  function exitAbbrDefinitionLabel () {
    const label = this.resume()
    const node = this.stack[this.stack.length - 1]
    node.identifier = label
  }

  function enterAbbrDefinitionValueString () {
    this.buffer()
  }

  function exitAbbrDefinitionValueString () {
    const node = this.stack.find(
      (node) => node.type === abbrTypes.abbrDefinition
    )
    if (node !== undefined) {
      node.value = this.resume()
    }
  }

  function exitAbbrDefinition (token) {
    this.exit(token)
  }
}

/**
 * Create an extension for `mdast-util-to-markdown` to enable abbreviations
 * in markdown.
 */
export function abbrToMarkdown () {
  return {
    handlers: {
      abbr: handleAbbr,
      abbrDefinition: handleAbbrDefinition
    }
  }

  function handleAbbr (node, _, state, info) {
    return state.safe(node.identifier, info)
  }

  function handleAbbrDefinition (node, _, state, info) {
    return state.safe(`*[${node.identifier}]: ${node.value}`, info)
  }
}

export default function plugin (options) {
  const opts = options || {}

  const self = this
  const data = self.data()

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])
  const toMarkdownExtensions =
    data.toMarkdownExtensions || (data.toMarkdownExtensions = [])

  micromarkExtensions.push(abbr)
  fromMarkdownExtensions.push(abbrFromMarkdown(opts))
  toMarkdownExtensions.push(abbrToMarkdown())
}
