# rehype-postfix-footnote-anchors [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]


This [rehype][rehype] plugin appends a custom postfix to footnotes, or changes the anchors/IDs to/from footnotes.

When you render several pieces of Markdown to HTML in a same webpage you might want to make sure that footnotes will not conflict between each piece of rendered HTML.

For instance:

*
    ```md
    foo[^foo]

    [^foo]: Footnote :)
    ```
*
    ```md
    bar[^foo]

    [^foo]: Conflict?
    ```

Rendering both of these will have the note next to `bar` link to `Footnote :)` instead of `Conflict?`, and `Conflict?` will have a link to go back to `foo` instead of `bar`.

This plugin plays well with [remark-numbered-footnotes](https://www.npmjs.com/package/remark-numbered-footnotes). Using `remark-numbered-footnotes` increases the risks of conflicts, hence the interest of postfixing footnote anchors.

## Installation

[npm][npm]:

```bash
npm install rehype-postfix-footnote-anchors
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const rehypePostfixFoonotes = require('rehype-postfix-footnote-anchors')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

```

Usage:

```javascript
unified()
  .use(reParse, {footnotes: true})
  .use(remark2rehype)
  .use(rehypePostfixFoonotes, postfix)
  .use(stringify)
```

## Configuration

In the above **Usage** example, postfix can be one of two things:

* a string: `postfix = '-my-postfix'`

    `postfix` will be appended to the existing footnotes identifiers

* a function: `postfix = (identifier: string): string => 'foo' + identifier + 'bar'`

    `postfix` will be called with the footnote identifier and should return a string

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/rehype-postfix-footnote-anchors/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/rehype-postfix-footnote-anchors

[rehype]: https://github.com/rehypejs/rehype
