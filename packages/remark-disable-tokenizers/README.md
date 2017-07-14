# remark-disable-tokenizers [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin can disable any or all remark `blockTokenizers` and `inlineTokenizers`. It not only disables the ones provided by remark core but any tokenizers that have been added to the remark parser whether through plugins or not.

## Configuration

Two options can be passed, as a single argument object:

    {block = [], inline = []}

Each of these can contain both tokenizer names as strings or arrays `['tokenizerName', 'error message']`.

* A string `name`: this tokenizer will be disabled
* An array `[name, message]`: this tokenizer, if used, will throw an `Error` with the message `message`

## Motivation

In some situations it might be interesting to only parse inline Markdown syntax. We created it for the purpose of parsing/rendering forum signatures -- short textual content people can use to sign their messages on web forums. In this context it made no sense to allow elements that would eat up a lot of vertical space.

## Installation

[npm][npm]:

```bash
npm install remark-disable-tokenizers
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkDisableBlocks = require('remark-disable-tokenizers')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkDisableTokenizers, {
    block: [
      'indentedCode',
      'fencedCode',
      // I'd like to ignore a bunch of blockTokenizers but specifically
      // I want blockquotes to throw this `Error` if used in the input Markdown
      ['blockquote', 'Blockquote are not allowed!'],
      'atxHeading',
      'setextHeading',
      'footnote',
      'table',
      'custom_blocks'
    ],
    inline: [
      'emphasis' // emphasis is the only inlineTokenizer I'm disallowing
    ]
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

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-disable-tokenizers/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-disable-tokenizers

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
