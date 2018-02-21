# remark-fix-guillemets [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin is used to fix `typographic-plugin` when this plugin is used with `remark-parse`.
Indeed, when `<<a>>` is parsed by `remark-parse`, the resulting tree is:

```
root[1] (1:1-1:6, 0-5)
└─ paragraph[3] (1:1-1:6, 0-5)
   ├─ text: "<" (1:1-1:2, 0-1)
   ├─ html: "<a>" (1:2-1:5, 1-4)
   └─ text: ">" (1:5-1:6, 0-1)
```

Because remark-textr is used to correct text nodes, here, `<<` is not replaced by `«`.

This plugin replaces the previous tree by:
```
root[1] (1:1-1:6, 0-5)
└─ paragraph[1] (1:1-1:6, 0-5)
   └─ text: "<<a>>" (1:1-1:6, 0-5)
```

## Install

[npm][npm]:

```sh
npm install --save remark-fix-guillemets
```


## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkFixGuillemets = require('remark-fix-guillemets')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkFixGuillemets)
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

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-fix-guillemets/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-fix-guillemets
