import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'

const render = text => unified()
  .use(reParse)
  .use(plugin)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

test('comments', () => {
  const { contents } = render(dedent`
    Test comments
    =============

    Foo<--COMMENTS I will be gone COMMENTS-->bar

    \`\`\`
    Foo<--COMMENTS I will not get remove because I am in a code block COMMENTS-->bar
    \`\`\`

    <--COMMENTS Unfinished block won't get parsed either
  `)
  expect(contents).toMatchSnapshot()
})
