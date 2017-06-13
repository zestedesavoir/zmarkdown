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

produces:

```html
<p><sub>subscript</sub>, e.g. a<sub>i</sub></p>
<p><sup>superscript</sup>, e.g. e<sup>x</sup></p>
```

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

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
