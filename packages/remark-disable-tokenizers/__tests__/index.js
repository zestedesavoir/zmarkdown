import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../src/'

test('block throws + inline', () => {
  function t () {
    unified()
      .use(reParse)
      .use(plugin, {
        block: [
          ['blockquote', 'Blockquote are not allowed!'],
        ],
        inline: [
          'emphasis'
        ]
      })
      .use(remark2rehype)
      .use(stringify)
      .processSync(dedent`
        *a*

        > *a*

        foo \`bar\` baz
      `)
  }

  expect(t).toThrowErrorMatchingSnapshot()
})

test('block + inline', () => {
  const { contents } = unified()
    .use(reParse)
    .use(plugin, {
      block: [
        'blockquote'
      ],
      inline: [
        'emphasis'
      ]
    })
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(contents).toMatchSnapshot()
})

test('block', () => {
  const { contents } = unified()
    .use(reParse)
    .use(plugin, {
      block: [
        'blockquote'
      ]
    })
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(contents).toMatchSnapshot()
})

test('inline', () => {
  const { contents } = unified()
    .use(reParse)
    .use(plugin, {
      inline: [
        'emphasis'
      ]
    })
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(contents).toMatchSnapshot()
})

test('inline throws', () => {
  function t () {
    unified()
      .use(reParse)
      .use(plugin, {
        inline: [
          ['emphasis', 'nope']
        ]
      })
      .use(remark2rehype)
      .use(stringify)
      .processSync(dedent`
        *a*

        > *a*

        foo \`bar\` baz
      `)
  }

  expect(t).toThrowErrorMatchingSnapshot()
})

test('block throws', () => {
  function t () {
    unified()
      .use(reParse)
      .use(plugin, {
        block: [
          ['blockquote', 'Blockquote are not allowed!'],
        ]
      })
      .use(remark2rehype)
      .use(stringify)
      .processSync(dedent`
        *a*

        > *a*

        foo \`bar\` baz
      `)
  }

  expect(t).toThrowErrorMatchingSnapshot()
})

test('block throws + inline throws', () => {
  function t () {
    unified()
      .use(reParse)
      .use(plugin, {
        block: [
          ['blockquote', 'Blockquote are not allowed!'],
        ],
        inline: [
          ['emphasis', 'Nope.'],
        ]
      })
      .use(remark2rehype)
      .use(stringify)
      .processSync(dedent`
        *a*

        > *a*

        foo \`bar\` baz
      `)
  }

  expect(t).toThrowErrorMatchingSnapshot()
})

test('does nothing', () => {
  const { contents } = unified()
    .use(reParse)
    .use(plugin)
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(contents).toMatchSnapshot()
})


test('unknown tokenizer', () => {
  const { contents } = unified()
    .use(reParse)
    .use(plugin, {
      inline: [
        'foo bar'
      ]
    })
    .use(remark2rehype)
    .use(stringify)
    .processSync(dedent`
      *a*

      > *a*

      foo \`bar\` baz
    `)

  expect(contents).toMatchSnapshot()
})
