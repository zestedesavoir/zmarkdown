import {preprocess, parse, postprocess} from 'micromark'
import {abbr, abbrTypes} from '../lib/syntax'

describe('micromark-extension-abbr', () => {
  it('parses definitions', () => {
    const input = `*[HTML]: Hyper Text Markup Language`
    const events = postprocess(
      parse({extensions: [abbr]})
        .document()
        .write(preprocess()(input, null, true)),
    )
    const eventTypes = events.map((event) => [event[0], event[1].type])
    expect(eventTypes).toEqual(
      // prettier-ignore
      [
        [ 'enter', 'content' ],
          [ 'enter', 'abbrDefinition' ],
            [ 'enter', 'abbrDefinitionLabel' ],
              [ 'enter', 'abbrDefinitionMarker' ],
              [ 'exit', 'abbrDefinitionMarker' ],
              [ 'enter', 'abbrDefinitionString' ],
                [ 'enter', 'data' ],
                [ 'exit', 'data' ],
              [ 'exit', 'abbrDefinitionString' ],
              [ 'enter', 'abbrDefinitionMarker' ],
              [ 'exit', 'abbrDefinitionMarker' ],
            [ 'exit', 'abbrDefinitionLabel' ],
            [ 'enter', 'abbrDefinitionMarker' ],
            [ 'exit', 'abbrDefinitionMarker' ],
            [ 'enter', 'lineSuffix' ],
            [ 'exit', 'lineSuffix' ],
            [ 'enter', 'abbrDefinitionValueString' ],
              [ 'enter', 'data' ],
              [ 'exit', 'data' ],
            [ 'exit', 'abbrDefinitionValueString' ],
          [ 'exit', 'abbrDefinition' ],
        [ 'exit', 'content' ],
    ],
    )
  })

  it('parses definitions without whitespace', () => {
    const input = `*[HTML]:Hyper Text Markup Language`
    const events = postprocess(
      parse({extensions: [abbr]})
        .document()
        .write(preprocess()(input, null, true)),
    )
    const eventTypes = events.map((event) => [event[0], event[1].type])
    expect(eventTypes).toEqual(
      // prettier-ignore
      [
        [ 'enter', 'content' ],
          [ 'enter', 'abbrDefinition' ],
            [ 'enter', 'abbrDefinitionLabel' ],
              [ 'enter', 'abbrDefinitionMarker' ],
              [ 'exit', 'abbrDefinitionMarker' ],
              [ 'enter', 'abbrDefinitionString' ],
                [ 'enter', 'data' ],
                [ 'exit', 'data' ],
              [ 'exit', 'abbrDefinitionString' ],
              [ 'enter', 'abbrDefinitionMarker' ],
              [ 'exit', 'abbrDefinitionMarker' ],
            [ 'exit', 'abbrDefinitionLabel' ],
            [ 'enter', 'abbrDefinitionMarker' ],
            [ 'exit', 'abbrDefinitionMarker' ],
            [ 'enter', 'abbrDefinitionValueString' ],
              [ 'enter', 'data' ],
              [ 'exit', 'data' ],
            [ 'exit', 'abbrDefinitionValueString' ],
          [ 'exit', 'abbrDefinition' ],
        [ 'exit', 'content' ],
    ],
    )
  })

  it('does not parse definitions with empty labels', () => {
    const input = `*[]: Empty`
    const events = postprocess(
      parse({extensions: [abbr]})
        .document()
        .write(preprocess()(input, null, true)),
    )
    const abbrDefinitions = events.filter(
      (event) => event[1].type === abbrTypes.abbrDefinition,
    )
    expect(abbrDefinitions).toEqual([])
  })

  it(
    'does not parse definitions with parens instead of square brackets',
    () => {
      const input = `*(HTML): Hyper Text Markup Language`
      const events = postprocess(
        parse({extensions: [abbr]})
          .document()
          .write(preprocess()(input, null, true)),
      )
      const abbrDefinitions = events.filter(
        (event) => event[1].type === abbrTypes.abbrDefinition,
      )
      expect(abbrDefinitions).toEqual([])
    },
  )

  it('does not parse definitions without colons', () => {
    const input = `*[HTML]; Hyper Text Markup Language`
    const events = postprocess(
      parse({extensions: [abbr]})
        .document()
        .write(preprocess()(input, null, true)),
    )
    const abbrDefinitions = events.filter(
      (event) => event[1].type === abbrTypes.abbrDefinition,
    )
    expect(abbrDefinitions).toEqual([])
  })

  it('parses definitions with labels containing spaces and punctuation', () => {
      const input = `*[MV(VSL) (E&W)]: Motor Vehicles (Variation of Speed Limits) (England & Wales) Regulations`
      const events = postprocess(
        parse({extensions: [abbr]})
          .document()
          .write(preprocess()(input, null, true)),
      )
      const abbrDefinitionString = events.find(
        (event) => event[1].type === abbrTypes.abbrDefinitionString,
      )
      if (abbrDefinitionString === undefined) {
        throw new Error('could not find an abbrDefinitionString')
      } else {
        const [_, token, context] = abbrDefinitionString
        expect(context.sliceSerialize(token)).toEqual('MV(VSL) (E&W)')
      }
    },
  )
})
