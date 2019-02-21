import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import split from '../src/'

const doSplit = (text, {splitDepth = 1,
  introductionAsProperty = true, conclusionAsProperty = false}) => {
  return split(unified().use(reParse).parse(text), {
    splitDepth: splitDepth,
    introductionAsProperty: introductionAsProperty,
    conclusionAsProperty: conclusionAsProperty})
}

const text = dedent `
  a global introduction
  
  # hello
  
  a paragraph
  
  > a quote to *ensure this is parsed*
  
  ## a sub title
  
  other paragraph
  
  # conclusion title
  
  paragraph
  `

test('default parameter with canonical text', () => {
  const result = doSplit(text, {})
  expect(result.introduction).toMatchObject({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'a global introduction',
          },
        ],
      },
    ],
  })
  expect(result.trees.length).toBe(2)
  expect(result.trees[0].introduction).toMatchObject({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'a paragraph',
          },
        ],
      },
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'a quote to ',
              },
              {
                type: 'emphasis',
                children: [
                  {
                    type: 'text',
                    value: 'ensure this is parsed',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  })
  expect(result.trees[1].introduction).toBeFalsy()
  expect(result.trees[0].conclusion).toBeFalsy()
  expect(result.trees[1].conclusion).toBeFalsy()
  expect(result.trees[0].children).toMatchObject({
    type: 'root',
    children: [
      {
        type: 'heading',
        depth: 2,
        children: [
          {
            type: 'text',
            value: 'a sub title',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'other paragraph',
          },
        ],
      },
    ],
  })
})

test('do not split introduction with canonical text', () => {
  const result = doSplit(text, {introductionAsProperty: false})
  expect(result.introduction).toMatchObject({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'a global introduction',
          },
        ],
      },
    ],
  })
  expect(result.trees.length).toBe(2)
  expect(result.trees[0].introduction).toBeFalsy()
  expect(result.trees[1].introduction).toBeFalsy()
  expect(result.trees[0].conclusion).toBeFalsy()
  expect(result.trees[1].conclusion).toBeFalsy()
  expect(result.trees[0].children).toMatchObject({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'a paragraph',
          },
        ],
      },
      {
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'a quote to ',
              },
              {
                type: 'emphasis',
                children: [
                  {
                    type: 'text',
                    value: 'ensure this is parsed',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        depth: 2,
        children: [
          {
            type: 'text',
            value: 'a sub title',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'other paragraph',
          },
        ],
      },
    ],
  })
})
