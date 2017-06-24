import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'

const render = (text, config) => unified()
  .use(reParse)
  .use(remark2rehype)
  .use(plugin, config)
  .use(stringify)
  .processSync(text)

test('with', () => {
  const { contents } = render(dedent`
    this plugin does

    * & -> &#x26;
    * &amp; -> &#x26;amp;
    * &eacute; -> &#x26;eacute;
  `)
  expect(contents).toMatchSnapshot()
})

test('without', () => {
  const { contents } = render(dedent`
    remark does

    * & -> &#x26;
    * &amp; -> &#x26;
    * &eacute; -> é
  `)
  expect(contents).toMatchSnapshot()
})

test('Errors with invalid config: []', () => {
  const fail = () => render('', [])
  expect(fail).toThrowError(Error)
})

test('Errors with invalid config: 1', () => {
  const fail = () => render('', 1)
  expect(fail).toThrowError(Error)
})
