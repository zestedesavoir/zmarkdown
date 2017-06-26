const request = require('sync-request')

const pattern = /[\s'"(,:<]?@(?:\*\*([^*]+)\*\*|(\w+))/

function locator (value, fromIndex) {
  const keep = pattern.exec(value, fromIndex)
  if (keep) {
    return value.indexOf('@', keep.index)
  }
  return -1
}

function plugin () {
  function zdsMemberExists (username) {
    try {
      const result = request('HEAD',
        `https://zestedesavoir.com/api/membres/exists/?search=${username}`,
        {timeout: 2000})
      return result.statusCode === 200
    } catch (ex) {
      return false
    }
  }

  function inlineTokenizer (eat, value, silent) {
    const keep = pattern.exec(value)
    if (!keep || keep.index > 0) return

    const total = keep[0]
    const username = keep[2] ? keep[2] : keep[1]

    if (zdsMemberExists(username)) {
      return eat(total)({
        type: 'ping',
        children: [{
          type: 'text',
          value: username
        }],
        data: {
          hName: 'a',
          hProperties: {
            href: `/membres/voir/${username}/`,
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
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.ping = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'ping')
}

module.exports = plugin
