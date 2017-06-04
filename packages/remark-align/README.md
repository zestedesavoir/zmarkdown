# remark-align [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax to center- or right-align elements.

It adds two new node types to the [mdast][mdast] produced by [remark][remark]:

* `CenterAligned`
* `RightAligned`

If you are using [rehype][rehype], the stringified HTML result will be `div`s with configurable CSS classes.

It is up to you to have CSS rules producing the desired result for these two classes.

## Syntax

Alignment is done by wrapping something in arrows indicating the alignment:

```markdown
->paragraph<-

->paragraph->
```

produces:

```html
<div class="some-class"><p>paragraph</p></div>
<div class="some-other-class"><p>paragraph</p></div>
```

## Installation

[npm][npm]:

```bash
npm install remark-align
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkAlign = require('remark-align')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkAlign, {
    right: 'align-right',
    center: 'align-center'
  })
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

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-align/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-align

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
