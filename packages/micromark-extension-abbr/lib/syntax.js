/**
 * @import {
 *   ConstructRecord,
 *   Extension,
 *   State,
 *   Tokenizer,
 * } from 'micromark-util-types'
 */
import { codes, types } from 'micromark-util-symbol'
import { factoryWhitespace } from 'micromark-factory-whitespace'
import { factoryLabel } from 'micromark-factory-label'
import {
  markdownLineEnding,
  markdownLineEndingOrSpace
} from 'micromark-util-character'

/**
 * @type {{
 * abbrDefinition: 'abbrDefinition',
 * abbrDefinitionLabel: 'abbrDefinitionLabel',
 * abbrDefinitionMarker: 'abbrDefinitionMarker',
 * abbrDefinitionString: 'abbrDefinitionString',
 * abbrDefinitionValueString: 'abbrDefinitionValueString',
 * }}
 */
export const abbrTypes = {
  abbrDefinition: 'abbrDefinition',
  abbrDefinitionLabel: 'abbrDefinitionLabel',
  abbrDefinitionMarker: 'abbrDefinitionMarker',
  abbrDefinitionString: 'abbrDefinitionString',
  abbrDefinitionValueString: 'abbrDefinitionValueString'
}

/**
 * @type {Tokenizer}
 */
function abbrDefinitionTokenize (effects, ok, nok) {
  const self = this

  return start

  /**
   * @type {State}
   *
   * *[HTML]: Hyper Text Markup Language
   * ^
   */
  function start (code) {
    effects.enter(abbrTypes.abbrDefinition)
    effects.consume(code)
    return abbrKeyDefinition
  }

  /**
   * @type {State}
   *
   * *[HTML]: Hyper Text Markup Language
   *  ^
   */
  function abbrKeyDefinition (code) {
    if (code === codes.leftSquareBracket) {
      return factoryLabel.call(
        self,
        effects,
        abbrKeyValueSeparator,
        nok,
        // @ts-ignore
        abbrTypes.abbrDefinitionLabel,
        abbrTypes.abbrDefinitionMarker,
        abbrTypes.abbrDefinitionString
      )(code)
    }

    return nok(code)
  }

  /**
   * @type {State}
   *
   * *[HTML]: Hyper Text Markup Language
   *        ^
   */
  function abbrKeyValueSeparator (code) {
    if (code === codes.colon) {
      effects.enter(abbrTypes.abbrDefinitionMarker)
      effects.consume(code)
      effects.exit(abbrTypes.abbrDefinitionMarker)
      return abbrKeyValueSeparatorAfter
    }

    return nok(code)
  }

  /**
   * @type {State}
   *
   * *[HTML]: Hyper Text Markup Language
   *         ^
   */
  function abbrKeyValueSeparatorAfter (code) {
    // Note: whitespace is optional.
    const isSpace = markdownLineEndingOrSpace(code)
    return isSpace
      ? factoryWhitespace(effects, abbrValueStart)(code)
      : abbrValueStart(code)
  }

  /**
   * @type {State}
   *
   * *[HTML]: Hyper Text Markup Language
   *          ^
   */
  function abbrValueStart (code) {
    effects.enter(abbrTypes.abbrDefinitionValueString)
    effects.enter(types.chunkString, { contentType: 'string' })
    return abbrValue(code)
  }

  /**
   * @type {State}
   *
   * *[HTML]: Hyper Text Markup Language
   *          ^^^^^^^^^^^^^^^^^^^^^^^^^^
   */
  function abbrValue (code) {
    if (markdownLineEnding(code) || code === codes.eof) {
      effects.exit(types.chunkString)
      effects.exit(abbrTypes.abbrDefinitionValueString)
      effects.exit(abbrTypes.abbrDefinition)
      return ok(code)
    }

    effects.consume(code)
    return abbrValue
  }
}

/**
 * @type {ConstructRecord}
 */
const contentInitial = {
  [codes.asterisk]: {
    name: 'abbrDefinition',
    tokenize: abbrDefinitionTokenize
  }
}

/**
 * @type {Extension}
 */
export const abbr = {
  contentInitial
}
