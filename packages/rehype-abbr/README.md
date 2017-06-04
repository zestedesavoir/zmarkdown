# rehype-abbr [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax to produce HTML abbreviations.

## Syntax

An abbreviation works the same as footnotes:

```markdown
This plugin works on HAST, an HTML AST
implemented by [rehype](https://github.com/wooorm/rehype)

*[HAST]: Hypertext Abstract Syntax Tree format.
*[AST]: Abstract syntax tree
```

produces:

```html
<p>This plugin works on <abbr title="Hypertext Abstract Syntax Tree format.">HAST</abbr>, an HTML <abbr title="Abstract syntax tree">AST</abbr>
implemented by <a href="https://github.com/wooorm/rehype">rehype</a></p>
```

## Installation

[npm][npm]:

```bash
npm install rehype-abbr
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const rehypeAbbr = require('rehype-abbr')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remark2rehype)
  .use(rehypeAbbr)
  .use(stringify)
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/rehype-abbr/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/rehype-abbr
