import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'

test('comments', () => {
  const render = text => unified()
    .use(reParse)
    .use(plugin)
    .use(remark2rehype)
    .use(stringify)
    .processSync(text)

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

test('comments custom different markers', () => {
  const render = text => unified()
    .use(reParse)
    .use(plugin, {
      beginMarker: 'foo',
      endMarker: 'bAR',
    })
    .use(remark2rehype)
    .use(stringify)
    .processSync(text)

  const { contents } = render(dedent`
    Test comments
    =============

    Foo<--foo I will be gone bAR-->bar

    \`\`\`
    Foo<--foo I will not get remove because I am in a code block bAR-->bar
    \`\`\`

    <--foo Unfinished block won't get parsed either
  `)
  expect(contents).toMatchSnapshot()
})

test('comments custom same markers', () => {
  const render = text => unified()
    .use(reParse)
    .use(plugin, {
      beginMarker: 'foo',
      endMarker: 'foo',
    })
    .use(remark2rehype)
    .use(stringify)
    .processSync(text)

  const { contents } = render(dedent`
    Test comments
    =============

    Foo<--foo I will be gone foo-->bar

    \`\`\`
    Foo<--foo I will not get remove because I am in a code block foo-->bar
    \`\`\`

    <--foo Unfinished block won't get parsed either
  `)
  expect(contents).toMatchSnapshot()
})
