import { micromark } from 'micromark'
import micromarkIframes from '../lib/index'
import micromarkIframesHtml from '../lib/html'

const specificationTests = {
  'works': ['!(https://www.youtube.com/watch?v=eLdiWe_HJv4)', '<iframe src="https://www.youtube.com/watch?v=eLdiWe_HJv4"></iframe>'],
  'no space after exclamation': ['! (https://www.youtube.com/watch?v=eLdiWe_HJv4)', '<p>! (https://www.youtube.com/watch?v=eLdiWe_HJv4)</p>'],
  'starts on line break': ['abab !(https://www.youtube.com/watch?v=eLdiWe_HJv4)', '<p>abab !(https://www.youtube.com/watch?v=eLdiWe_HJv4)</p>'],
  'ends on line break': ['!(https://www.youtube.com/watch?v=eLdiWe_HJv4)ono', '<p>!(https://www.youtube.com/watch?v=eLdiWe_HJv4)ono</p>'],
  'escape exclamation': ['\\!(https://www.youtube.com/watch?v=eLdiWe_HJv4)', '<p>!(https://www.youtube.com/watch?v=eLdiWe_HJv4)</p>'],
  'escape parenthesis': ['!\\(https://www.youtube.com/watch?v=eLdiWe_HJv4)', '<p>!(https://www.youtube.com/watch?v=eLdiWe_HJv4)</p>'],
  'no line breaks inside': ['!(link\nmultilines)', '<p>!(link\nmultilines)</p>'],
  'no autoframe': ['https://jsfiddle.net/zgjhjv9j/', '<p>https://jsfiddle.net/zgjhjv9j/</p>'],
  'no closing parenthesis inside': ['!(https://www.youtube.com/watch?v=eLd)We_HJv4)', '<p>!(https://www.youtube.com/watch?v=eLd)We_HJv4)</p>'],
  'no escaped closing parenthesis inside': ['!(https://www.youtube.com/watch?v=eLd\\)We_HJv4)', '<p>!(https://www.youtube.com/watch?v=eLd)We_HJv4)</p>'],
  'frame in frame': ['!(https://www.youtube.com/watch?v=eLdWe_HJv4!(http://jsfiddle.net/zgjhjv9j/))', '<p>!(https://www.youtube.com/watch?v=eLdWe_HJv4!(http://jsfiddle.net/zgjhjv9j/))</p>'],
  'is leaf block': ['### !(https://www.youtube.com/watch?v=eLdWe_HJv4)', '<h3>!(https://www.youtube.com/watch?v=eLdWe_HJv4)</h3>']
}

const renderString = (fixture) =>
  micromark(fixture, {
    extensions: [micromarkIframes()],
    htmlExtensions: [micromarkIframesHtml]
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
