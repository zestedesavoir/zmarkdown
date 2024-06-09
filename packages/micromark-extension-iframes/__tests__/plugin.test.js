import { micromark } from 'micromark'
import micromarkIframes from '../lib/index'
import micromarkIframesHtml from '../lib/html'

test('can take custom characters', () => {
  const input = ':[https://www.youtube.com/watch?v=eLdiWe_HJv4]'
  const output = micromark(input, {
    extensions: [micromarkIframes({
      exclamationChar: 58,
      openingChar: 91,
      closingChar: 93
    })],
    htmlExtensions: [micromarkIframesHtml]
  })

  expect(output).toEqual('<iframe src="https://www.youtube.com/watch?v=eLdiWe_HJv4"></iframe>')
})
