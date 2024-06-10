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
  const CONSTRUCT_SUB_NAME = 'subString'
  const CONSTRUCT_SUPER_NAME = 'superString'

  return tokenizeSubSuper

  function tokenizeSubSuper (effects, ok, nok) {
    let constructSequenceName
    return start

    function isMatchingConstruct (code) {
      return (
        (constructSequenceName !== CONSTRUCT_SUB_NAME && code === superCharCode) ||
        (constructSequenceName !== CONSTRUCT_SUPER_NAME && code === subCharCode)
      )
    }

    function start (code) {
      // We should not have entered here at all
      if (code !== subCharCode && code !== superCharCode) return nok(code)

      effects.enter('subSuperCall')
      effects.enter('subSuperSequence')
      effects.consume(code)
      effects.exit('subSuperSequence')

      if (code === subCharCode) constructSequenceName = CONSTRUCT_SUB_NAME
      else if (code === superCharCode) constructSequenceName = CONSTRUCT_SUPER_NAME

      effects.enter(constructSequenceName)
      effects.enter('chunkText', { contentType: 'text' })

      return afterStart
    }

    function afterStart (code) {
      if (isMatchingConstruct(code) || code === codes.space) return nok(code)

      return content(code)
    }

    function content (code) {
      if (isMatchingConstruct(code)) return end(code)
      if (code === codes.eof || markdownLineEnding(code)) return nok(code)

      effects.consume(code)
      return content
    }

    function end (code) {
      effects.exit('chunkText')
      effects.exit(constructSequenceName)
      effects.enter('subSuperSequence')
      effects.consume(code)
      effects.exit('subSuperSequence')
      effects.exit('subSuperCall')

      return ok
    }
  }
}
