function plugin (ctx) {
  if (!ctx.pingUsername || typeof ctx.pingUsername !== 'function') {
    throw new Error(`remark-ping: expected configuration to be passed: {
  pingUsername: (username) => bool,
  userURL: (username) => string\n}`)
  }
  if (!ctx.userURL || typeof ctx.userURL !== 'function') {
    throw new Error(`remark-ping: expected configuration to be passed: {
  pingUsername: (username) => bool,
  userURL: (username) => string\n}`)
  }

  const pattern = ctx.usernameRegex || /[\s'"(,:<]?@(?:\*\*([^*]+)\*\*|(\w+))/

  function inlineTokenizer (eat, value, silent) {
    const keep = pattern.exec(value)
    if (!keep || keep.index > 0) return

    const total = keep[0]
    const username = keep[2] ? keep[2] : keep[1]

    if (ctx.pingUsername(username)) {
      const url = ctx.userURL(username)
      return eat(total)({
        type: 'ping',
        url: url,
        children: [{
          type: 'text',
          value: username
        }],
        data: {
          hName: 'a',
          hProperties: {
            href: url,
            class: 'ping'
          }
        }
      })
    } else {
      return eat(total[0])({
        type: 'text',
        value: total[0]
      })
    }
  }

  function locator (value, fromIndex) {
    const keep = pattern.exec(value, fromIndex)
    if (keep) {
      return value.indexOf('@', keep.index)
    }
    return -1
  }

  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.ping = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'ping')

  const Compiler = this.Compiler

  // Stringify
  if (Compiler) {
    const visitors = Compiler.prototype.visitors
    visitors.ping = (node) => `@**${this.all(node).join('')}**`
  }
}

module.exports = plugin
