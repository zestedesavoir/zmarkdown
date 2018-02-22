# remark-comments [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax for Markdown source comments.

## Syntax

You can insert comments in the Markdown source this way:

```markdown
Foo<--COMMENTS I am a comment COMMENTS-->bar
```

Everything between `<--COMMENTS` and `COMMENTS-->` will be absent from the HTML output. Compiling to Markdown will preserve all comments.

## Installation

[npm][npm]:

```bash
npm install remark-comments
```

## Configuration

Two options can be passed, as a single argument object:

    {beginMarker = 'COMMENTS', endMarker = 'COMMENTS'}

Therefore, invoking this plugin this way:

```js
  .use(remarkComments, {
    beginMarker: 'foo',
    endMarker: 'bar'
  })
```

will make this plugin remove what's put between `<--foo` and `bar-->`.

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkComments = require('remark-comments')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkComments)
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

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-comments/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-comments
