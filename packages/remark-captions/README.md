# remark-caption [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This [remark][remark] plugin adds custom syntax to add a caption to elements which might benefit from a legend. It wraps the said element in a `figure` node with `figcaption` node as last child. It is particularly interesting for use with quotes, images, tables, code blocks.

It follows a "whitelist" approach: for each [mdast][mdast] node type for which you want to allow captioning you'll have to add a configuration property mapping a node type to its caption "trigger".

## Syntax

```markdown
> Do it or do it not, there is no try
Source: A little green man, with a saber larger than himself
```

This takes what follows `Source: ` until the end of the block containing `Source: ` and puts this inside a `figcaption` mdast node. What precedes it becomes children of a `figure` node, the last child of this `figure` node being `figcaption`.

Used with `rehype`, it generates the corresponding HTML elements.

```javascript
interface figure <: Parent {
  type: 'figure'
  data: {
    hName: 'figure',
  }
}
```

```javascript
interface figcaption <: Parent {
  type: 'figcaption'
  data: {
    hName: 'figcaption',
  }
}
```

This plugin handles two different types of caption/legend nodes :

- `internalLegend`: when the caption, after being parsed by `remark`, is inside the captioned element or inside its wrapping paragraph:
   - blockquote
   - image
   - inlineMath
   - iframe
   - ...
- `externalLegend`: when the caption, after being parsed by `remark`, is outside the captioned element or after its wrapping paragraph:
   - table
   - code
   - math
   - ...


## Installation

[npm][npm]:

```bash
npm install remark-caption
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkCaption = require('remark-caption')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkCaption, {
    external: {
      table: 'Table:',
      code: 'Code:',
      math: 'Equation:',
    },
    internal: {
      image: 'Figure:',
    }
  })
  .use(remark2rehype)
  .use(stringify)
```

By default, it features :

```javascript
external = {
  table: 'Table:',
  code: 'Code:',
}

internal = {
  blockquote: 'Source:',
  image: 'Figure:',
}
```

## Other examples


This enables you to deal with such a code:

    ```python
    a_highlighted_code('blah')
    ```
    Code: My code *caption*

will yield

```javascript
{
  type: 'figure',
  data: {
    hName: 'figure'
  },
  children: [
    {
      type: 'code',
      language: 'python',
      value: '\na_highlighted_code(\'blah\')\n'
    },
    {
      type: 'figcaption',
      data: {
        hName: 'figcaption'
      }
      children: [
        {
          type: 'text',
          value: 'My code '
        },
        {
          type: 'em',
          children: [
            {
              type: 'text',
              value: 'caption'
            }
          ]
        }
      ]
    }
  ]
}
```

Tables are also supported, example:

```markdown
head1| head2
-----|------
bla|bla
Table: figcapt1
```

Associated with `remark-rehype` this generates a HTML tree encapsulated inside a `<figure>` tag

```html
<figure>
  <table>
    <thead>
      <tr>
        <th>head1</th>
        <th>head2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>bla</td>
        <td>bla</td>
      </tr>
    </tbody>
  </table>
  <figcaption>figcapt1</figcaption>
</figure>
```

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-captions/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-captions

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark
