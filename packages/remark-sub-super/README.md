# remark-sub-super [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax to handle subscript and superscript.
It adds new nodes types to the [mdast][mdast] produced by [remark][remark]:

* `sub`
* `sup`

If you are using [rehype][rehype], the stringified HTML result will be `sub` or `sup`.

## Syntax

```markdown
~subscript~, e.g. a~i~

^superscript^, e.g. e^x^
```

## AST (see [mdast][mdast] specification)

`Sub` ([`Parent`][parent]) represents a subscript text.

```javascript
interface Sub <: Parent {
  type: "sub";
}
```

`Sup` ([`Parent`][parent]) represents a superscript text.

```javascript
interface Sup <: Parent {
  type: "sup";
}
```

For example, the following markdown:

```markdown
a^x^

x~i~
```

Yields:

```javascript
{
  type: 'paragraph',
  children: [{
    type: 'text',
    value: 'a',
    children: [{
      type: 'sup',
      children: [{
        type: 'text',
        value: 'x'
      }]
    }]
  }]
},
{
  type: 'paragraph',
  children: [{
    type: 'text',
    value: 'x',
    children: [{
      type: 'sub',
      children: [{
        type: 'text',
        value: 'i'
      }]
    }]
  }]
}
```

## Rehype

This plugin is compatible with [rehype][rehype]. `Sub` mdast nodes will become `<sub>contents</sub>`, `Sup` mdast nodes will become `<sup>contents</sup>`.

## Installation

[npm][npm]:

```bash
npm install remark-sub-super
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkSubSuper = require('remark-sub-super')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkSubSuper)
  .use(remark2rehype)
  .use(stringify)
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-sub-super/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-sub-super

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[parent]: https://github.com/syntax-tree/unist#parent
