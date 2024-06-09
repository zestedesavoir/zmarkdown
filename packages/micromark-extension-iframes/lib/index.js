import { markdownLineEnding } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol'

export default function micromarkIframes (options = {}) {
  // Character definitions, see specification, part 1
  const exclamationChar = options.exclamationChar || 33
  const openingChar = options.openingChar || 40
  const closingChar = options.closingChar || 41

  const call = {
    name: 'iframe',
    tokenize: tokenizeFactory({
      exclamationChar,
      openingChar,
      closingChar
    })
  }

  // Inject a hook on the exclamation mark
  return {
    flow: { [exclamationChar]: call }
  }
}

function tokenizeFactory (charCodes) {
  // Extract character code
  const {
    exclamationChar,
    openingChar,
    closingChar
  } = charCodes

  return tokenizeIframe

  function tokenizeIframe (effects, ok, nok) {
    return start

    // Define a state `iframeStart` that consumes the exclamation mark
    function start (code) {
      // Discard invalid characters
      if (code !== exclamationChar) return nok(code)

      effects.enter('iframeLinkDelimiter')
      effects.consume(code)

      return openingParens
    }

    function openingParens (code) {
      if (code !== openingChar) return nok(code)

      effects.consume(code)
      const endToken = effects.exit('iframeLinkDelimiter')
      endToken._type = 'start'
      effects.enter('iframeLink')
      effects.enter('data')

      return link
    }

    function link (code) {
      if (code === closingChar) return closingParens

      // Forbid EOL and EOF
      if (code === codes.eof || markdownLineEnding(code)) {
        return nok(code)
      }

      effects.consume(code)

      return link
    }

    function closingParens (code) {
      if (code !== closingChar) return link

      effects.exit('data')
      effects.exit('iframeLink')

      effects.enter('iframeLinkDelimiter')
      effects.consume(code)
      const endToken = effects.exit('iframeLinkDelimiter')
      endToken._type = 'end'

      return finalBreak
    }

    function finalBreak (code) {
      return (code === codes.eof || markdownLineEnding(code)) ? ok(code) : nok(code)
    }
  }
}
