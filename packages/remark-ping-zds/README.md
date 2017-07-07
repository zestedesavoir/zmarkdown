# remark-ping-zds [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax and creates links to users on https://zestedesavoir.com.

## Syntax

```markdown
@username
@**a username**

```

produces:

```html
<a href="/membres/voir/username" class="ping">username</a>
<a href="/membres/voir/a username" class="ping">a username</a>
```

If `username` and `a username` is used on https://zestedesavoir.com/ or:

```html
@username
@<strong>a username</a>
```

If they aren't used.


## Installation

[npm][npm]:

```bash
npm install remark-ping-zds
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkPingZds = require('remark-ping-zds')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkPingZds)
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

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-ping-zds/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-ping-zds

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
