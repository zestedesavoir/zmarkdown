This plugin allows you to add caption for figurative elements and source to quotation.

It follows a "whitelist" approach : you just have to say "for this type of MDAST element I want to enable caption."

#Syntax 

```markdown
> Do it or do it not, there is no try
Source: A little green man, with a saber larger than himself
```

This removes the `Source` from the tree and add a `author` attribute to the blockquote element.

At the end, it wraps everything in a new MDAST element `figure` fully compatible with `rehype`.

The newly created caption is encapsulated inside a `figcaption` element.

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

- `internalLegend` : this means your legend should normally be inside the captionned element or inside its wrapping paragraph :
   - blockquote
   - image
   - inlineMath
   - ...
- `externalLegend` : this means your legend should normally be outside the block AND its wrapping paragraph
   - table
   - code


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
      image: 'Figure:'
    }
    })
  .use(remark2rehype)
  .use(stringify)
```

By default, it features :

```javascript
external = {
  table: 'Table:',
  code: 'Code:'
}

internal = {
  blockquote: 'Source:',
  image: 'Figure:'
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
  }
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

Table are also supported with such a code :

```markdown
head1| head2
-----|------
bla|bla
Table: figcapt1
```

Associated with `remark-rehype` this generates a HTML tree encapsulated inside `<figure>` tag

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