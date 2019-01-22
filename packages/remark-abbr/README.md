# remark-abbr [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This [remark][remark] plugin parses custom Markdown syntax to produce (HTML) abbreviations.

It introduces a new [MDAST][mdast] node type: "abbr".

```javascript
interface abbr <: Node {
  type: "abbr";
  abbr: string;
  reference: string;
  data: {
    hName: "abbr";
    hProperties: {
      title: string;
    }
  }
}
```

## Syntax

Abbreviations are defined a bit like footnotes:

```markdown
This plugin works on MDAST, a Markdown AST
implemented by [remark](https://github.com/remarkjs/remark)

*[MDAST]: Markdown Abstract Syntax Tree.
*[AST]: Abstract syntax tree
```

This would compile to the following HTML:

```html
<p>This plugin works on <abbr title="Markdown Abstract Syntax Tree.">MDAST</abbr>, a Markdown <abbr title="Abstract syntax tree">AST</abbr>
implemented by <a href="https://github.com/remarkjs/remark">remark</a></p>
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

## Options

### options.expandFirst

Expand the first occurrence of each abbreviation in place to introduce the definition and it's definition. Further occurrences are parsed into "abbr" [MDAST][mdast] nodes as the plugin would normally do.

**example**

```javascript
.use(remarkAbbr, { expandFirst: true })
```

**given**

```markdown
This plugin works on MDAST.

More stuff about MDAST.

*[MDAST]: Markdown Abstract Syntax Tree
```

**produces**

```html
<p>This plugin works on Markdown Abstract Syntax Tree (<abbr title="Markdown Abstract Syntax Tree">MDAST</abbr>).</p>
<p>More stuff about <abbr title="Markdown Abstract Syntax Tree">MDAST</abbr>.</p>"
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

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/remarkjs/remark
