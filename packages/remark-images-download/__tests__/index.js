import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

jest.mock('fs')
jest.mock('request-promise')

import plugin from '../src/'

const render = text => unified()
  .use(reParse)
  .use(plugin)
  .use(remark2rehype)
  .use(stringify)
  .process(text)


test('downloads image ok', () => {
  const file = dedent`
    ![](http://example.com/ok.png)
  `

  render(file)
    .then((e) => {
      console.log(e)
    })
    .catch((e) => console.error(e))
})

test('does not crash without images', () => {
  const file = dedent`
    foo
  `

  render(file).then((e) => console.log(e)).catch((e) => console.error(e))
})

test('skips bigger images', () => {
  const file = dedent`
    ![](http://example.com/too-big.png)
  `
  expect(render(file)).resolves.toMatchSnapshot()
})

test('skips wrong mimes', () => {
  const file = dedent`
    ![](http://example.com/wrong-mime.png)
  `
  expect(render(file)).resolves.toMatchSnapshot()
})

test('does not report wrong extensions', () => {
  const file = dedent`
    ![](http://example.com/wrong.ext)
  `

  expect(render(file)).resolves.toMatchSnapshot()
})
