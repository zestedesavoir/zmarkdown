# remark-abbr [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax to produce (HTML) abbreviations.

## Syntax

An abbreviation works the same as footnotes:

```markdown
This plugin works on MDAST, a Markdown AST
implemented by [remark](https://github.com/wooorm/remark)

*[MDAST]: Markdown Abstract Syntax Tree.
*[AST]: Abstract syntax tree
```

produces:

```html
<p>This plugin works on <abbr title="Markdown Abstract Syntax Tree.">MDAST</abbr>, a Markdown <abbr title="Abstract syntax tree">AST</abbr>
implemented by <a href="https://github.com/wooorm/remark">remark</a></p>
```

## Installation

[npm][npm]:

```bash
npm install remark-abbr
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkAbbr = require('remark-abbr')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkAbbr)
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

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-abbr/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-abbr
