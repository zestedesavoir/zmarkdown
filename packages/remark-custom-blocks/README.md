# remark-custom-blocks [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax to create new custom blocks.
It adds new nodes types to the [mdast][mdast] produced by [remark][remark]:

* `{yourType}CustomBlock`

If you are using [rehype][rehype], the stringified HTML result will be `div`s with configurable CSS classes.

It is up to you to have CSS rules producing the desired result for these classes.

## Syntax

```markdown
[[yourType]]
| Here goes the content. Content gets parsed,
| so you could use quotes or anything inside of them:
| > Hello **World**!
```

produces:

```html
<div class="some-class some-other-class"><p>Here goes the content. Content gets parsed,
so you could use quotes or anything inside of them:
</p>
<blockquote><p>Hello <strong>World</strong>!</blockquote></div>
```

with the following configuration object:

```js
{
  yourType: 'some-class some-other-class',
}
```

## Installation

[npm][npm]:

```bash
npm install remark-custom-blocks
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkCustomBlocks = require('remark-custom-blocks')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkCustomBlocks, {
    someType: 'a-css-class another-class',
    anotherType: 'foo',
  })
  .use(remark2rehype)
  .use(stringify)
```

As you can see, configuration is an object `Type: 'space separated classes'`.

The sample configuration provided above would have the following effect:

1. Allows you to use the following Markdown syntax to create blocks:

    ```markdown
    [[someType]]
    | content
    [[anotherType]]
    | content
    ```

1. This Remark plugin would create [mdast][mdast] nodes for these two blocks, these nodes would be of type:

    * `someTypeCustomBlock`
    * `anotherTypeCustomBlock`

1. If you're using [rehype][rehype], you will end up with `div`s like these:

    * `<div class="a-css-class another-class">…`
    * `<div class="foo">…`

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-custom-blocks/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-custom-blocks

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
