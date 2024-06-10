import syntax from 'micromark-extension-sub-super'

function fromMarkdown () {
  function enterSubString (token) {
    this.enter({
      type: 'sub',
      data: {
        hName: 'sub'
      },
      children: []
    }, token)
  }

  function enterSuperString (token) {
    this.enter({
      type: 'sup',
      data: {
        hName: 'sup'
      },
      children: []
    }, token)
  }

  function exitSubString (token) {
    this.exit(token)
  }

  function exitSuperString (token) {
    this.exit(token)
  }

  return {
    enter: {
      subString: enterSubString,
      superString: enterSuperString
    },
    exit: {
      subString: exitSubString,
      superString: exitSuperString
    }
  }
}

function toMarkdown (subChar, superChar) {
  function handle (char, name) {
    return function (node, _, state, info) {
      const tracker = state.createTracker(info)
      const exit = state.enter(name)
      let value = tracker.move(char)
      value += state.containerPhrasing(node, {
        ...tracker.current(),
        before: value,
        after: char
      })
      value += tracker.move(char)
      exit()
      return value
    }
  }

  const handleSub = handle(subChar, 'sub')
  const handleSuper = handle(superChar, 'super')

  handleSub.peek = () => subChar
  handleSuper.peek = () => superChar

  return {
    unsafe: [
      { character: subChar, inConstruct: 'phrasing' },
      { character: superChar, inConstruct: 'phrasing' }
    ],
    handlers: {
      sub: handleSub,
      sup: handleSuper
    }
  }
}

export default function subSuperPlugin (options = {}) {
  // Default chars when not provided
  const subChar = options.subChar || '~'
  const superChar = options.superChar || '^'

  const subCharCode = subChar.charCodeAt(0)
  const superCharCode = superChar.charCodeAt(0)

  const data = this.data()

  function add (field, value) {
    if (data[field]) data[field].push(value)
    else data[field] = [value]
  }

  // Inject handlers
  add('micromarkExtensions', syntax({ subCharCode, superCharCode }))
  add('fromMarkdownExtensions', fromMarkdown())
  add('toMarkdownExtensions', toMarkdown(subChar, superChar))
}
