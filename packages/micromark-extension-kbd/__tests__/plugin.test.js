import { micromark } from 'micromark'
import micromarkKbd from '../lib/index'
import micromarkKbdHtml from '../lib/html'

test('can take a custom character', () => {
  const input = '++Ctrl++'
  const output = micromark(input, {
    extensions: [micromarkKbd({ charCode: 43 })],
    htmlExtensions: [micromarkKbdHtml]
  })

  expect(output).toEqual('<p><kbd>Ctrl</kbd></p>')
})

test('delete orphans', () => {
  const input = '||a|| bc ||d'
  const output = micromark(input, {
    extensions: [micromarkKbd()],
    htmlExtensions: [micromarkKbdHtml]
  })

  expect(output).toEqual('<p><kbd>a</kbd> bc ||d</p>')
})