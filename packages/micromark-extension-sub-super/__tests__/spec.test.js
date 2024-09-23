import { micromark } from 'micromark'
import micromarkSubSuper from '../lib/index'
import micromarkSubSuperHtml from '../lib/html'

const specificationTests = {
  'works - sub': ['CO~2~', '<p>CO<sub>2</sub></p>'],
  'works - super': ['a^2^ + b^2^ = c^2^', '<p>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></p>'],
  'inside words': ['Literally s^e^lfies tbh lo-fi.', '<p>Literally s<sup>e</sup>lfies tbh lo-fi.</p>'],
  'needs content - sub': ['a~~', '<p>a~~</p>'],
  'needs content - super': ['b^^', '<p>b^^</p>'],
  'space isn\'t content - sub': ['a~ ~', '<p>a~ ~</p>'],
  'space isn\'t content - super': ['b^ ^', '<p>b^ ^</p>'],
  'double entry': ['^^foo^^', '<p>^<sup>foo</sup>^</p>'],
  'more than one char': ['a^1+1^ + b^1+1^ = c^1+1^', '<p>a<sup>1+1</sup> + b<sup>1+1</sup> = c<sup>1+1</sup></p>'],
  'does not start with space - sub': ['a~ ~ + b~ ~', '<p>a~ ~ + b~ ~</p>'],
  'does not start with space - super': ['a^ ^ + b^ ^', '<p>a^ ^ + b^ ^</p>'],
  'cannot contain block': ['a~b\n\nc~', '<p>a~b</p>\n<p>c~</p>'],
  'escaped - sub': ['a\\~no\\~', '<p>a~no~</p>'],
  'escaped - super': ['a\\^no\\^', '<p>a^no^</p>'],
  'escaped inside': ['a^\\^^', '<p>a<sup>^</sup></p>', true],
  'lone tilde': ['a ~ b', '<p>a ~ b</p>'],
  'can contain inline - super': ['my ^*important*^ superscript', '<p>my <sup><em>important</em></sup> superscript</p>', true],
  'can contain inline - sub': ['my ~*important*~ subscript', '<p>my <sub><em>important</em></sub> subscript</p>', true],
  'can be contained': ['my *im~por~tant* subscript', '<p>my <em>im<sub>por</sub>tant</em> subscript</p>'],
  'can be self-contained': ['2^2^2^^ = 16', '<p>2<sup>2<sup>2</sup></sup> = 16</p>', true],
  'can be cross-contained': ['remark-~sub-^super^~', '<p>remark-<sub>sub-<sup>super</sup></sub></p>', true]
}

const renderString = (fixture) =>
  micromark(fixture, {
    extensions: [micromarkSubSuper()],
    htmlExtensions: [micromarkSubSuperHtml]
  })

describe('conforms to the specification', () => {
  for (const test in specificationTests) {
    const jestFunction = (!specificationTests[test][2]) ? it : it.skip

    jestFunction(test, () => {
      const [input, expectedOutput] = specificationTests[test]
      const output = renderString(input)

      expect(output).toEqual(expectedOutput)
    })
  }
})
