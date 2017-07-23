import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

jest.mock('fs')
jest.mock('request')

import plugin from '../src/'

const render = text => unified()
  .use(reParse)
  .use(plugin)
  .use(remark2rehype)
  .use(stringify)
  .process(text)


test('download-image ok', () => {
  const file = dedent`
    ![](http://example.com/ok.png)
  `
  debugger
  render(file).then((e) => console.log(e)).catch((e) => console.error(e))
})

test.skip('download-image too big', () => {
  const file = dedent`
    ![](http://example.com/too-big.png)
  `
  expect(render(file)).resolves.toMatchSnapshot()
})

test.skip('download-image wrong mime', () => {
  const file = dedent`
    ![](http://example.com/wrong-mime.png)
  `
  expect(render(file)).resolves.toMatchSnapshot()
})

test.skip('download-image wrong ext', () => {
  const file = dedent`
    ![](http://example.com/wrong.ext)
  `

  expect(render(file)).resolves.toMatchSnapshot()
})
