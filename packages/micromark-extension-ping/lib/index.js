import { markdownLineEnding, markdownLineEndingOrSpace } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol'

export default function micromarkPing (options = {}) {
  // Character definitions, see specification, part 1
  const escapeChar = 92
  const atChar = options.pingChar || 64
  const sequenceChar = options.sequenceChar || 42

  const call = {
    name: 'ping',
    tokenize: tokenizeFactory({
      atChar,
      escapeChar,
      sequenceChar
    })
  }

  // Inject a hook on the at symbol
  return {
    text: { [atChar]: call }
  }
}

function tokenizeFactory (charCodes) {
  // Extract character code
  const {
    atChar,
    escapeChar,
    sequenceChar
  } = charCodes

  return tokenizePing

  function pingEnd (code) {
    return (markdownLineEndingOrSpace(code) || code === codes.eof)
  }

  function pingForcedEnd (code) {
    return (markdownLineEnding(code) || code === codes.eof)
  }

  function tokenizePing (effects, ok, nok) {
    let hasSequence = false
    let hasContent = false
    let token

    return atSymbol

    // Define a state `pingAtSymbol` that consumes the at symbol
    function atSymbol (code) {
      // Discard invalid characters
      if (code !== atChar) return nok(code)

      effects.enter('pingCall')
      effects.enter('pingAtSymbol')
      effects.consume(code)
      effects.exit('pingAtSymbol')

      return start
    }

    // Define a state `pingStart` that matches starting star sequence
    function start (code) {
      // Disallow empty pings
      if (pingEnd(code)) return nok(code)
      // Handle star sequences
      if (code === sequenceChar) return potentialStartSequence(code)
      // Handle escaped opening sequence
      if (code === escapeChar) return nok(code)

      effects.enter('pingContent')
      effects.enter('data')

      return content(code)
    }

    // Define a state `pingPotentialStartSequence` that consumes the first star in a sequence
    function potentialStartSequence (code) {
      if (code !== sequenceChar) return nok(code)

      token = effects.enter('pingStarSequence')
      effects.consume(code)

      return startSequence
    }

    // Define a state `pingStartSequence` that handles a star sequence
    function startSequence (code) {
      // Sequences of only one star are content if ending
      if (pingEnd(code)) {
        token.type = 'pingContent'

        const { start } = token

        token = effects.enter('data')
        token.start = start
        effects.exit('data')
        effects.exit('pingContent')
        effects.exit('pingCall')

        return ok(code)
      }

      if (code !== sequenceChar) return nok(code)

      hasSequence = true

      effects.consume(code)
      effects.exit('pingStarSequence')

      effects.enter('pingContent')
      effects.enter('chunkString', { contentType: 'string' })

      return content
    }

    // Define a state `pingContent` that consumes the ping content
    function content (code) {
      // May end with star sequence
      if (code === sequenceChar) {
        return potentialEndSequence(code)
      }

      // Ends with space
      if (!hasSequence && pingEnd(code)) {
        effects.exit('data')
        effects.exit('pingContent')
        effects.exit('pingCall')

        return ok(code)
      }

      // Forced end
      if (pingForcedEnd(code)) return nok(code)

      hasContent = true
      effects.consume(code)

      return (code === escapeChar) ? contentEscape : content
    }

    // Define a state `pingContentEscape` to allow end sequence escape
    function contentEscape (code) {
      effects.consume(code)

      return content
    }

    // Define a state `pingPotentialEndSequence` that matches an end star sequence
    function potentialEndSequence (code) {
      if (code !== sequenceChar) {
        return content(code)
      }

      effects.exit('chunkString')
      effects.exit('pingContent')
      token = effects.enter('pingStarSequence')
      effects.consume(code)

      return endSequence
    }

    // Define a state `pingEndSequence` that handles a star sequence
    function endSequence (code) {
      // Ends with star sequence
      if (code === sequenceChar) {
        if (!hasContent) {
          return nok(code)
        }

        effects.consume(code)
        effects.exit('pingStarSequence')
        effects.exit('pingCall')

        return ok
      }

      // Sequences of only one star are content if ending
      if (pingEnd(code)) return nok(code)

      token.type = 'pingContent'

      const { start } = token
      token = effects.enter('chunkString', { contentType: 'string' })
      token.start = start

      return content(code)
    }
  }
}
