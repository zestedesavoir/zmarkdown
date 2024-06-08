import syntax from 'micromark-extension-kbd'

function fromMarkdown () {
  function enterKbdData (token) {
    this.enter({
      type: 'kbd',
      data: {
        hName: 'kbd'
      },
      children: []
    },
    token)
  }

  function exitKbdData (token) {
    this.exit(token)
  }

  return {
    enter: {
      kbdCallString: enterKbdData
    },
    exit: {
      kbdCallString: exitKbdData
    }
  }
}

function toMarkdown (char) {
  const doubleChar = char + char

  handleKbd.peek = peekKbd

  function handleKbd (node, _, state, info) {
    const tracker = state.createTracker(info)
    const exit = state.enter('kbd')
    let value = tracker.move(doubleChar)
    value += state.containerPhrasing(node, {
      ...tracker.current(),
      before: value,
      after: char
    })
    value += tracker.move(doubleChar)
    exit()
    return value
  }

  function peekKbd () {
    return char
  }

  return {
    unsafe: [{ character: char, inConstruct: 'phrasing' }],
    handlers: { kbd: handleKbd }
  }
}

export default function kbdPlugin (options = {}) {
  // Default char when not provided
  const char = options.char || '|'
  const charCode = char.charCodeAt(0)
  const data = this.data()

  function add (field, value) {
    if (data[field]) data[field].push(value)
    else data[field] = [value]
  }

  // Inject handlers
  add('micromarkExtensions', syntax({ charCode }))
  add('fromMarkdownExtensions', fromMarkdown())
  add('toMarkdownExtensions', toMarkdown(char))
}
