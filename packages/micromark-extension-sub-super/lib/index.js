import { markdownLineEnding } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol'

export default function micromarkSubSuper (options = {}) {
  // By default, use characters U+94 (`^`) and U+126 (`~`)
  const unicodeSubChar = options.subCharCode || 126
  const unicodeSuperChar = options.superCharCode || 94

  const call = {
    name: 'subSuper',
    tokenize: tokenizeFactory(unicodeSubChar, unicodeSuperChar)
  }

  // Inject a hook called on the given characters
  return {
    text: {
      [unicodeSubChar]: call,
      [unicodeSuperChar]: call
    }
  }
}

function tokenizeFactory (subCharCode, superCharCode) {
  return tokenizeSubSuper

  function tokenizeSubSuper (effects, ok, nok) {
    return start

    function start (code) {
      // We should not have entered here at all
      if (code !== subCharCode && code !== superCharCode) return nok(code)

      effects.enter('subSuperCall')
      effects.enter('subSuperSequence')
      effects.consume(code)
      effects.exit('subSuperSequence')

      if (code === subCharCode) effects.enter('subString')
      else if (code === superCharCode) effects.enter('superString')
      effects.enter('data')

      return afterStart
    }

    function afterStart (code) {
      if (code === subCharCode ||
          code === superCharCode ||
          code === codes.space) return nok(code)

      return content(code)
    }

    function content (code) {
      if (code === subCharCode) return subEnd(code)
      else if (code === superCharCode) return superEnd(code)

      if (code === codes.eof || markdownLineEnding(code)) return nok(code)

      effects.consume(code)
      return content
    }

    function subEnd (code) {
      effects.exit('data')
      effects.exit('subString')
      return end(code)
    }

    function superEnd (code) {
      effects.exit('data')
      effects.exit('superString')
      return end(code)
    }

    function end (code) {
      effects.enter('subSuperSequence')
      effects.consume(code)
      effects.exit('subSuperSequence')
      effects.exit('subSuperCall')

      return ok
    }
  }
}
