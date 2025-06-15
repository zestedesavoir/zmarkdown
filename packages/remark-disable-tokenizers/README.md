# remark-disable-tokenizers

This [remark][remark] plugin can disable any tokenizer, be it provided by CommonMark core, or by any other tokenizer that has been added to the remark parser whether through plugins or not.

## Configuration

The only option that can be passed to this plugin is a list of underlying [micromark][micromark] tokenizers to be disabled.

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
  	// Emphasis + bold
  	'attention',
    'indentedCode',
    'fencedCode',
    'blockQuote'
  })
  .use(remark2rehype)
  .use(stringify)
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-disable-tokenizers/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-disable-tokenizers

[remark]: https://github.com/remarkjs/remark

[micromark]: https://github.com/micromark/micromark
