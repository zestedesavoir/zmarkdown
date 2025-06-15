# remark-kbd

This plugin parses custom Markdown syntax to handle keyboard keys.
It adds a new node type to the [mdast][mdast] produced by [remark][remark]: `kbd`.

If you are using [rehype][rehype], the stringified HTML result will be `<kbd>`.

## Syntax

```markdown
Hit ||enter|| twice to create a new paragraph.
```

## AST (see [mdast][mdast] specification)

`Kbd` ([`Parent`][parent]) represents a reference to a user.

```javascript
interface Kbd <: Parent {
  type: "kbd";
}
```

For example, the following markdown:

`||enter||`

Yields:

```javascript
{
  type: 'kbd',
  children: [{
    type: 'text',
    value: 'enter'
  }]
}
```

## Rehype

This plugin is compatible with [rehype][rehype]. `Kbd` mdast nodes will become `<kbd>contents</kbd>`.

## Installation

[npm][npm]:

```bash
npm install remark-kbd
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')
const remarkKbd = require('remark-kbd')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkKbd)
  .use(remark2rehype)
  .use(stringify)
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-kbd/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-kbd

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[parent]: https://github.com/syntax-tree/unist#parent
