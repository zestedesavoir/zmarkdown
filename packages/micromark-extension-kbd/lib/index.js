import { markdownLineEnding } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol'

export default function micromarkKbd (options = {}) {
  // By default, use the Unicode character U+124 (`|`)
  const unicodeChar = options.charCode || 124

  const call = {
    name: 'kbd',
    tokenize: tokenizeFactory(unicodeChar)
  }

  // Inject a hook called on the given character
  return {
    text: { [unicodeChar]: call }
  }
}

function tokenizeFactory (charCode) {
  return tokenizeKbd

  function tokenizeKbd (effects, ok, nok) {
    let token
    let previous

    return start

    // Define a state `start` that consumes the first pipe character
    function start (code) {
      // Discard all characters except for the required one
      if (code !== charCode) return nok(code)

      effects.enter('kbdCall')
      effects.enter('kbdCallDelimiter')
      effects.consume(code)

      return startSequence
    }

    // Define a state `startSequence` that consumes another pipe character
    function startSequence (code) {
      if (code !== charCode) return nok(code)

      effects.consume(code)
      effects.exit('kbdCallDelimiter')
      effects.enter('kbdCallString')
      effects.enter('chunkString', { contentType: 'string' })

      return startContent
    }

    // Define a state `startContent` to prevent keyboard entries from starting with a space
    function startContent (code) {
      // Space before? Invalid sequence
      if (code === codes.space) return nok(code)

      // Forbid EOL and EOF
      if (code === codes.eof || markdownLineEnding(code)) {
        return nok(code)
      }

      effects.consume(code)

      return content
    }

    // Define a state `content` to parse the inside
    function content (code) {
      // Allow one more pipe inside, but no more
      if (code === charCode) {
        effects.exit('chunkString')
        effects.exit('kbdCallString')
        token = effects.enter('kbdCallDelimiter')
        effects.consume(code)

        return potentialEnd
      }

      // Forbid EOL and EOF
      if (code === codes.eof || markdownLineEnding(code)) {
        return nok(code)
      }

      effects.consume(code)
      previous = code

      return content
    }

    // Define a state `potentialEnd` to match the last pipe
    function potentialEnd (code) {
      // Not a pipe? Switch back to content
      if (code !== charCode) {
        token.type = 'kbdCallString'
        effects.enter('chunkString', { contentType: 'string' })

        return content(code)
      }

      // Space after? Invalid sequence
      if (previous === codes.space) return nok(code)

      effects.consume(code)

      return extraPipe
    }

    // Define a state `extraPipe` to allow an additionnal pipe (for `|||||`)
    function extraPipe (code) {
      const eaten = (code === charCode)

      if (eaten) {
        effects.consume(code)
        token._hasExtra = true
      }

      effects.exit('kbdCallDelimiter')
      effects.exit('kbdCall')

      return eaten ? ok : ok(code)
    }
  }
}
